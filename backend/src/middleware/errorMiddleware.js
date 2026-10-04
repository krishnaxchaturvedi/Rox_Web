import { fail } from '../utils/response.js';
export function notFound(req,res){return fail(res,404,'Route not found.');}
export function errorHandler(err,req,res,next){
 console.error(err);
 if(err.type==='entity.parse.failed')return fail(res,400,'Invalid JSON request body.');
 if(err.code==='23505')return fail(res,409,'A record with this value already exists.');
 if(err.code==='23503')return fail(res,400,'The referenced record does not exist.');
 if(err.code==='22P02')return fail(res,400,'Invalid identifier or value.');
 return fail(res,500,'Internal server error.');
}