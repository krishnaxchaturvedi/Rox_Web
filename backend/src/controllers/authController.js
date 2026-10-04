import { findUserByEmail,findUserById,createUser } from '../models/User.js';
import { query } from '../config/database.js';
import { hashPassword,comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { ok,fail } from '../utils/response.js';
import { validateSignup,validateLogin,validatePassword } from '../validators/authValidator.js';

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