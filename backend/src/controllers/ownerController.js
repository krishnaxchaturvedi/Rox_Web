import { query } from '../config/database.js';
import { ok, fail } from '../utils/response.js';

export async function dashboard(req,res,next){
  try{
    const store=(await query(
      'SELECT id,name,address FROM stores WHERE owner_id=$1',
      [req.user.id]
    )).rows[0];

    if(!store)return fail(res,404,'No store is assigned to this owner.');

    const summary=(await query(
      `SELECT COALESCE(ROUND(AVG(rating)::numeric,1),0)::float AS average_rating,
              COUNT(*)::int AS rating_count
       FROM ratings WHERE store_id=$1`,
      [store.id]
    )).rows[0];

    const distributionRows=(await query(
      `SELECT rating,COUNT(*)::int AS count
       FROM ratings WHERE store_id=$1
       GROUP BY rating ORDER BY rating DESC`,
      [store.id]
    )).rows;

    const ratings=(await query(
      `SELECT r.id,u.id AS user_id,u.name AS user_name,u.email AS user_email,
              r.rating,r.updated_at
       FROM ratings r
       JOIN users u ON u.id=r.user_id
       WHERE r.store_id=$1
       ORDER BY r.updated_at DESC`,
      [store.id]
    )).rows;

    const total=Number(summary.rating_count);
    const distribution={};
    for(const n of [5,4,3,2,1]){
      const row=distributionRows.find(x=>Number(x.rating)===n);
      distribution[n]={
        count:row?.count||0,
        percentage:total?Math.round((Number(row?.count||0)/total)*100):0
      };
    }

    return ok(res,{
      store,
      averageRating:summary.average_rating,
      totalRatings:total,
      distribution,
      ratings
    });
  }catch(e){next(e);}
}