import jwt from 'jsonwebtoken';
import {env} from '../config/env.js';
export const signToken=payload=>{
 if(!env.jwtSecret)throw new Error('JWT_SECRET is not configured.');
 return jwt.sign({id:payload.id,email:payload.email,role:payload.role},env.jwtSecret,{expiresIn:'7d'});
};
export const verifyToken=token=>{
 if(!env.jwtSecret)throw new Error('JWT_SECRET is not configured.');
 return jwt.verify(token,env.jwtSecret);
};