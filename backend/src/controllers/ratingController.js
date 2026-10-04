import { query } from '../config/database.js';
import { upsertRating } from '../models/Rating.js';
import { ok,fail } from '../utils/response.js';
export async function saveRating(req,res,next){
  try{
    const storeId=Number(req.body.storeId), rating=Number(req.body.rating);
    if(!Number.isInteger(storeId)||rating<1||rating>5) return fail(res,400,'Rating must be between 1 and 5.');
    const store=(await query('SELECT id FROM stores WHERE id=$1',[storeId])).rows[0];
    if(!store) return fail(res,404,'Store not found.');
    return ok(res,{rating:await upsertRating({userId:req.user.id,storeId,rating})},'Rating saved.');
  }catch(e){next(e);}
}