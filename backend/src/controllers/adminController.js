import { query } from '../config/database.js';
import { hashPassword } from '../utils/password.js';
import { ok,fail } from '../utils/response.js';
export async function stats(req,res,next){try{
 const [u,s,r]=await Promise.all([query('SELECT COUNT(*)::int count FROM users'),query('SELECT COUNT(*)::int count FROM stores'),query('SELECT COUNT(*)::int count FROM ratings')]);
 return ok(res,{users:u.rows[0].count,stores:s.rows[0].count,ratings:r.rows[0].count});
}catch(e){next(e);}}
export async function users(req,res,next){try{
 const q=req.query.search||'',role=req.query.role||'';
 const rows=(await query(`SELECT id,name,email,address,role,created_at FROM users WHERE ($1='' OR name ILIKE '%'||$1||'%' OR email ILIKE '%'||$1||'%' OR address ILIKE '%'||$1||'%') AND ($2='' OR role=$2) ORDER BY name ASC`,[q,role])).rows;
 return ok(res,{users:rows});}catch(e){next(e);}}
export async function userDetails(req,res,next){try{const row=(await query('SELECT id,name,email,address,role,created_at FROM users WHERE id=$1',[req.params.id])).rows[0]; if(!row)return fail(res,404,'User not found.'); return ok(res,{user:row});}catch(e){next(e);}}
export async function createUser(req,res,next){try{
 const {name,email,address='',password,role='USER'}=req.body;
 const user=await query('INSERT INTO users(name,email,address,password_hash,role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,address,role',[name,email,address,await hashPassword(password),role]);
 return ok(res,{user:user.rows[0]},'User created.');}catch(e){next(e);}}
export async function stores(req,res,next){try{const rows=(await query('SELECT s.id,s.name,s.email,s.address,s.owner_id,COALESCE(ROUND(AVG(r.rating)::numeric,1),0) average_rating,COUNT(r.id)::int rating_count FROM stores s LEFT JOIN ratings r ON r.store_id=s.id GROUP BY s.id ORDER BY s.name')).rows; return ok(res,{stores:rows});}catch(e){next(e);}}