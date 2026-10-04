import { query } from '../config/database.js';
import { upsertRating } from '../models/Rating.js';
import { ok,fail } from '../utils/response.js';

export async function saveRating(req,res,next){
  try{
    const storeId=Number(req.body.storeId), rating=Number(req.body.rating);
    if(!Number.isInteger(storeId)||!Number.isInteger(rating)||rating<1||rating>5)
      return fail(res,400,'Rating must be an integer between 1 and 5.');
    const store=(await query('SELECT id FROM stores WHERE id=$1',[storeId])).rows[0];
    if(!store)return fail(res,404,'Store not found.');
    const saved=await upsertRating({userId:req.user.id,storeId,rating});
    return ok(res,{rating:saved},'Rating saved.');
  }catch(e){next(e);}
}

export async function getMyRating(req,res,next){
  try{
    const row=(await query('SELECT id,store_id,rating,updated_at FROM ratings WHERE user_id=$1 AND store_id=$2',[req.user.id,req.params.storeId])).rows[0];
    return ok(res,{rating:row||null});
  }catch(e){next(e);}
}