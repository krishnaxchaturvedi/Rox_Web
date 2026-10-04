import { query } from '../config/database.js';
import { ok,fail } from '../utils/response.js';
export async function dashboard(req,res,next){try{
 const store=(await query('SELECT id,name,address FROM stores WHERE owner_id=$1',[req.user.id])).rows[0];
 if(!store)return fail(res,404,'No store is assigned to this owner.');
 const summary=(await query('SELECT COALESCE(ROUND(AVG(rating)::numeric,1),0) average_rating,COUNT(*)::int rating_count FROM ratings WHERE store_id=$1',[store.id])).rows[0];
 const ratings=(await query('SELECT u.id,u.name,u.email,r.rating,r.updated_at FROM ratings r JOIN users u ON u.id=r.user_id WHERE r.store_id=$1 ORDER BY r.updated_at DESC',[store.id])).rows;
 return ok(res,{store,summary,ratings});
}catch(e){next(e);}}