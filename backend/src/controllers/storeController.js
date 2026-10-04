import { listStores } from '../models/Store.js';
import { ok } from '../utils/response.js';

export async function getStores(req,res,next){
  try{
    const stores=await listStores(req.query.search||'',req.user.id);
    return ok(res,{stores});
  }catch(e){next(e);}
}