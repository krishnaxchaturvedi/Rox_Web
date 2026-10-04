import { listStores } from '../models/Store.js';
import { ok } from '../utils/response.js';
export async function getStores(req,res,next){try{return ok(res,{stores:await listStores(req.query.search||'')});}catch(e){next(e);}}