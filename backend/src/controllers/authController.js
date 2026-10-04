import { findUserByEmail,findUserById,createUser } from '../models/User.js';
import { query } from '../config/database.js';
import { hashPassword,comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { ok,fail } from '../utils/response.js';
import { validatePassword } from '../validators/authValidator.js';

export async function signup(req,res,next){
  try{
    const {name,email,password,address='',role='USER'}=req.body;
    if(role !== 'USER') return fail(res,403,'Public signup is only available for normal users.');
    const user=await createUser({name:name.trim(),email:email.trim(),address,passwordHash:await hashPassword(password)});
    return ok(res,{user,token:signToken(user)},'Account created.');
  }catch(e){next(e);}
}
export async function login(req,res,next){
  try{
    const user=await findUserByEmail(req.body.email.trim());
    if(!user || !(await comparePassword(req.body.password,user.password_hash))) return fail(res,401,'Invalid email or password.');
    const safe={id:user.id,name:user.name,email:user.email,address:user.address,role:user.role};
    return ok(res,{user:safe,token:signToken(safe)},'Login successful.');
  }catch(e){next(e);}
}
export async function me(req,res,next){
  try{return ok(res,{user:await findUserById(req.user.id)});}catch(e){next(e);}
}
export async function changePassword(req,res,next){
  try{
    const {currentPassword,newPassword}=req.body;
    if(!validatePassword(newPassword)) return fail(res,400,'New password must be 8-16 characters with uppercase and special character.');
    const user=await findUserByEmail(req.user.email);
    if(!user || !(await comparePassword(currentPassword,user.password_hash))) return fail(res,400,'Current password is incorrect.');
    const newHash=await hashPassword(newPassword);
    await query('UPDATE users SET password_hash=$1,updated_at=NOW() WHERE id=$2',[newHash,req.user.id]);
    return ok(res,null,'Password updated.');
  }catch(e){next(e);}
}