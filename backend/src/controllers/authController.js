import { findUserByEmail,findUserById,createUser } from '../models/User.js';
import { query } from '../config/database.js';
import { hashPassword,comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import crypto from 'node:crypto';
import { sendPasswordResetOtp } from '../utils/mailer.js';
import { ok,fail } from '../utils/response.js';
import { validateSignup,validateLogin,validatePassword } from '../validators/authValidator.js';
const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signup(req,res,next){
 try{
  const {name,email,password,address='',role='USER'}=req.body;
  if(role!=='USER')return fail(res,403,'Public signup is only available for normal users.');
  const errors=validateSignup(req.body);
  if(Object.keys(errors).length)return fail(res,400,'Validation failed.',errors);
  const exists=await findUserByEmail(email.trim());
  if(exists)return fail(res,409,'Email is already registered.');
  const user=await createUser({name:name.trim(),email:email.trim(),address:address.trim(),passwordHash:await hashPassword(password)});
  const safe={id:user.id,name:user.name,email:user.email,address:user.address,role:user.role};
  return ok(res,{user:safe,token:signToken(safe)},'Account created.');
 }catch(e){next(e);}
}
export async function login(req,res,next){
 try{
  const errors=validateLogin(req.body);
  if(Object.keys(errors).length)return fail(res,400,'Validation failed.',errors);
  const user=await findUserByEmail(req.body.email.trim());
  if(!user||!(await comparePassword(req.body.password,user.password_hash)))return fail(res,401,'Invalid email or password.');
  const safe={id:user.id,name:user.name,email:user.email,address:user.address,role:user.role};
  return ok(res,{user:safe,token:signToken(safe)},'Login successful.');
 }catch(e){next(e);}
}
export async function me(req,res,next){
 try{
  const user=await findUserById(req.user.id);
  if(!user)return fail(res,401,'Account no longer exists.');
  return ok(res,{user});
 }catch(e){next(e);}
}
export async function requestPasswordReset(req,res,next){
 try{
  const email=String(req.body.email||'').trim().toLowerCase();
  const generic='If the email is registered, a password reset OTP has been sent.';
  if(!emailRegex.test(email))return fail(res,400,'Enter a valid email.');
  const user=await findUserByEmail(email); if(!user)return ok(res,null,generic);
  const otp=String(crypto.randomInt(100000,1000000));
  const otpHash=crypto.createHash('sha256').update(otp).digest('hex');
  await query('DELETE FROM password_reset_tokens WHERE user_id=$1 OR expires_at<NOW()',[user.id]);
  await query("INSERT INTO password_reset_tokens(user_id,otp_hash,expires_at,attempts) VALUES($1,$2,NOW()+INTERVAL '10 minutes',0)",[user.id,otpHash]);
  await sendPasswordResetOtp(user.email,otp); return ok(res,null,generic);
 }catch(e){next(e);}
}
export async function verifyPasswordResetOtp(req,res,next){
 try{
  const email=String(req.body.email||'').trim().toLowerCase(),otp=String(req.body.otp||'').trim();
  if(!emailRegex.test(email)||!/^[0-9]{6}$/.test(otp))return fail(res,400,'Enter a valid email and 6-digit OTP.');
  const user=await findUserByEmail(email); if(!user)return fail(res,400,'Invalid or expired OTP.');
  const row=(await query('SELECT id,otp_hash,attempts,expires_at FROM password_reset_tokens WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1',[user.id])).rows[0];
  if(!row||new Date(row.expires_at)<new Date()||row.attempts>=5)return fail(res,400,'Invalid or expired OTP.');
  const hash=crypto.createHash('sha256').update(otp).digest('hex');
  if(!crypto.timingSafeEqual(Buffer.from(hash),Buffer.from(row.otp_hash))){await query('UPDATE password_reset_tokens SET attempts=attempts+1 WHERE id=$1',[row.id]);return fail(res,400,'Invalid or expired OTP.');}
  const resetToken=crypto.randomBytes(32).toString('hex'),resetHash=crypto.createHash('sha256').update(resetToken).digest('hex');
  await query('UPDATE password_reset_tokens SET verified_at=NOW(),reset_token_hash=$1 WHERE id=$2',[resetHash,row.id]);
  return ok(res,{resetToken},'OTP verified. You can now set a new password.');
 }catch(e){next(e);}
}
export async function resetPassword(req,res,next){
 try{
  const email=String(req.body.email||'').trim().toLowerCase(),resetToken=String(req.body.resetToken||'').trim(),newPassword=req.body.newPassword;
  if(!emailRegex.test(email)||!resetToken||!validatePassword(newPassword))return fail(res,400,'Enter a valid email, reset token and a valid new password.');
  const user=await findUserByEmail(email); if(!user)return fail(res,400,'Invalid or expired reset request.');
  const tokenHash=crypto.createHash('sha256').update(resetToken).digest('hex');
  const row=(await query("SELECT id FROM password_reset_tokens WHERE user_id=$1 AND reset_token_hash=$2 AND verified_at IS NOT NULL AND verified_at>NOW()-INTERVAL '15 minutes' AND expires_at>NOW() ORDER BY created_at DESC LIMIT 1",[user.id,tokenHash])).rows[0];
  if(!row)return fail(res,400,'Invalid or expired reset request.');
  await query('UPDATE users SET password_hash=$1,updated_at=NOW() WHERE id=$2',[await hashPassword(newPassword),user.id]);
  await query('DELETE FROM password_reset_tokens WHERE user_id=$1',[user.id]);
  return ok(res,null,'Password reset successfully. Please sign in.');
 }catch(e){next(e);}
}
export async function changePassword(req,res,next){
 try{
  const {currentPassword,newPassword}=req.body;
  if(!currentPassword)return fail(res,400,'Current password is required.');
  if(!validatePassword(newPassword))return fail(res,400,'New password must be 8-16 characters with uppercase and special character.');
  const user=await findUserById(req.user.id);
  if(!user)return fail(res,401,'Account no longer exists.');
  const stored=await findUserByEmail(user.email);
  if(!stored||!(await comparePassword(currentPassword,stored.password_hash)))return fail(res,400,'Current password is incorrect.');
  if(await comparePassword(newPassword,stored.password_hash))return fail(res,400,'New password must be different from the current password.');
  await query('UPDATE users SET password_hash=$1,updated_at=NOW() WHERE id=$2',[await hashPassword(newPassword),req.user.id]);
  return ok(res,null,'Password updated. Please sign in again on other sessions.');
 }catch(e){next(e);}
}