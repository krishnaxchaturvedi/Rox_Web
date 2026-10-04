import { fail } from '../utils/response.js';
export function notFound(req,res){ return fail(res,404,'Route not found.'); }
export function errorHandler(err,req,res,next){
  console.error(err);
  if(err.code === '23505') return fail(res,409,'A record with this value already exists.');
  return fail(res,500,'Internal server error.');
}