import { fail } from '../utils/response.js';
export function requireFields(fields){
 return (req,res,next)=>{
  const missing=fields.filter(f=>req.body?.[f]===undefined||req.body?.[f]===null||String(req.body[f]).trim()==='');
  if(missing.length)return fail(res,400,'Required fields are missing.',Object.fromEntries(missing.map(f=>[f,'This field is required.'])));
  next();
 };
}