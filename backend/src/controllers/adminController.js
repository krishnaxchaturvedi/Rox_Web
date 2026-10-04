import { query } from '../config/database.js';
import { hashPassword } from '../utils/password.js';
import { ok,fail } from '../utils/response.js';
import { validateUserInput,validateStoreInput } from '../validators/adminValidator.js';

const userSort={name:'name',email:'email',address:'address',role:'role',created_at:'created_at'};
const storeSort={name:'s.name',email:'s.email',address:'s.address',rating:'average_rating'};

export async function stats(req,res,next){try{
 const [u,s,r]=await Promise.all([query('SELECT COUNT(*)::int count FROM users'),query('SELECT COUNT(*)::int count FROM stores'),query('SELECT COUNT(*)::int count FROM ratings')]);
 return ok(res,{users:u.rows[0].count,stores:s.rows[0].count,ratings:r.rows[0].count});
}catch(e){next(e);}}

export async function users(req,res,next){try{
 const q=String(req.query.search||'').trim(),role=String(req.query.role||'').toUpperCase(),sort=userSort[req.query.sort]||'name',dir=req.query.direction==='desc'?'DESC':'ASC';
 const rows=(await query(`SELECT id,name,email,address,role,created_at FROM users
 WHERE ($1='' OR name ILIKE '%'||$1||'%' OR email ILIKE '%'||$1||'%' OR address ILIKE '%'||$1||'%')
 AND ($2='' OR role::text=$2) ORDER BY ${sort} ${dir}, id ASC`,[q,role])).rows;
 return ok(res,{users:rows});
}catch(e){next(e);}}

export async function userDetails(req,res,next){try{
 const row=(await query('SELECT id,name,email,address,role,created_at FROM users WHERE id=$1',[req.params.id])).rows[0];
 if(!row)return fail(res,404,'User not found.');
 return ok(res,{user:row});
}catch(e){next(e);}}

export async function createUser(req,res,next){try{
 const body={...req.body,role:String(req.body.role||'USER').toUpperCase()};
 const errors=validateUserInput(body);
 if(Object.keys(errors).length)return fail(res,400,'Validation failed.',errors);
 const exists=(await query('SELECT id FROM users WHERE email=$1',[body.email.trim()])).rows[0];
 if(exists)return fail(res,409,'Email is already registered.');
 const user=await query('INSERT INTO users(name,email,address,password_hash,role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,address,role',[body.name.trim(),body.email.trim(),body.address||'',await hashPassword(body.password),body.role]);
 return ok(res,{user:user.rows[0]},'User created.');
}catch(e){next(e);}}

export async function updateUser(req,res,next){try{
 const current=(await query('SELECT id,name,email,address,role FROM users WHERE id=$1',[req.params.id])).rows[0];
 if(!current)return fail(res,404,'User not found.');
 const body={name:req.body.name,email:req.body.email,address:req.body.address,role:String(req.body.role||current.role).toUpperCase(),password:req.body.password};
 const errors=validateUserInput(body,{passwordRequired:Boolean(body.password)});
 if(Object.keys(errors).length)return fail(res,400,'Validation failed.',errors);
 const duplicate=(await query('SELECT id FROM users WHERE email=$1 AND id<>$2',[body.email.trim(),req.params.id])).rows[0];
 if(duplicate)return fail(res,409,'Email is already registered.');
 const params=[body.name.trim(),body.email.trim(),body.address||'',body.role,req.params.id];
 let sql='UPDATE users SET name=$1,email=$2,address=$3,role=$4,updated_at=NOW() WHERE id=$5';
 if(body.password){sql='UPDATE users SET name=$1,email=$2,address=$3,role=$4,password_hash=$6,updated_at=NOW() WHERE id=$5';params.push(await hashPassword(body.password));}
 await query(sql,params);
 const fresh=(await query('SELECT id,name,email,address,role FROM users WHERE id=$1',[req.params.id])).rows[0];
 return ok(res,{user:fresh},'User updated.');
}catch(e){next(e);}}

export async function deleteUser(req,res,next){try{
 if(Number(req.params.id)===Number(req.user.id))return fail(res,400,'You cannot delete your own admin account.');
 const deleted=(await query('DELETE FROM users WHERE id=$1 RETURNING id',[req.params.id])).rows[0];
 if(!deleted)return fail(res,404,'User not found.');
 return ok(res,{id:deleted.id},'User deleted.');
}catch(e){next(e);}}

export async function stores(req,res,next){try{
 const q=String(req.query.search||'').trim(),sort=storeSort[req.query.sort]||'name',dir=req.query.direction==='desc'?'DESC':'ASC';
 const rows=(await query(`SELECT s.id,s.name,s.email,s.address,s.owner_id,u.name AS owner_name,
 COALESCE(ROUND(AVG(r.rating)::numeric,1),0)::float AS average_rating,COUNT(r.id)::int rating_count
 FROM stores s LEFT JOIN users u ON u.id=s.owner_id LEFT JOIN ratings r ON r.store_id=s.id
 WHERE ($1='' OR s.name ILIKE '%'||$1||'%' OR s.email ILIKE '%'||$1||'%' OR s.address ILIKE '%'||$1||'%')
 GROUP BY s.id,u.name ORDER BY ${sort} ${dir}, s.id ASC`,[q])).rows;
 return ok(res,{stores:rows});
}catch(e){next(e);}}

export async function createStore(req,res,next){try{
 const errors=validateStoreInput(req.body);
 if(Object.keys(errors).length)return fail(res,400,'Validation failed.',errors);
 const ownerId=req.body.ownerId?Number(req.body.ownerId):null;
 if(ownerId){const owner=(await query("SELECT id FROM users WHERE id=$1 AND role='OWNER'",[ownerId])).rows[0];if(!owner)return fail(res,400,'Owner must be an existing Store Owner.');}
 const row=(await query('INSERT INTO stores(name,email,address,owner_id) VALUES($1,$2,$3,$4) RETURNING id,name,email,address,owner_id',[req.body.name.trim(),req.body.email||null,req.body.address||'',ownerId])).rows[0];
 return ok(res,{store:row},'Store created.');
}catch(e){next(e);}}

export async function updateStore(req,res,next){try{
 const current=(await query('SELECT id FROM stores WHERE id=$1',[req.params.id])).rows[0];
 if(!current)return fail(res,404,'Store not found.');
 const errors=validateStoreInput(req.body);
 if(Object.keys(errors).length)return fail(res,400,'Validation failed.',errors);
 const ownerId=req.body.ownerId?Number(req.body.ownerId):null;
 if(ownerId){const owner=(await query("SELECT id FROM users WHERE id=$1 AND role='OWNER'",[ownerId])).rows[0];if(!owner)return fail(res,400,'Owner must be an existing Store Owner.');}
 try{
  const row=(await query('UPDATE stores SET name=$1,email=$2,address=$3,owner_id=$4,updated_at=NOW() WHERE id=$5 RETURNING id,name,email,address,owner_id',[req.body.name.trim(),req.body.email||null,req.body.address||'',ownerId,req.params.id])).rows[0];
  return ok(res,{store:row},'Store updated.');
 }catch(e){if(e.code==='23505')return fail(res,409,'That owner is already assigned to another store.');throw e;}
}catch(e){next(e);}}

export async function deleteStore(req,res,next){try{
 const row=(await query('DELETE FROM stores WHERE id=$1 RETURNING id',[req.params.id])).rows[0];
 if(!row)return fail(res,404,'Store not found.');
 return ok(res,{id:row.id},'Store deleted.');
}catch(e){next(e);}}