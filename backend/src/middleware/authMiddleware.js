import { verifyToken } from '../utils/jwt.js';
import { fail } from '../utils/response.js';

export function authenticate(req,res,next){
  try{
    const header=req.headers.authorization || '';
    if(!header.startsWith('Bearer ')) return fail(res,401,'Authentication required.');
    req.user=verifyToken(header.slice(7));
    next();
  }catch{ return fail(res,401,'Invalid or expired token.'); }
}