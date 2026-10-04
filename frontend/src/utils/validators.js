export const validateName=v=>v.trim().length>=20&&v.trim().length<=60?'':'Name must be 20-60 characters.';
export const validateAddress=v=>v.length<=400?'':'Address must be at most 400 characters.';
export const validateEmail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?'':'Invalid email.';
export const validatePassword=v=>/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(v)?'':'Password must be 8-16 chars with uppercase and special character.';
export const validateRating=v=>Number.isInteger(Number(v))&&Number(v)>=1&&Number(v)<=5?'':'Rating must be 1-5.';
export const validateUserForm=d=>Object.fromEntries(Object.entries({name:validateName(d.name||''),email:validateEmail(d.email||''),address:validateAddress(d.address||''),password:validatePassword(d.password||'')}).filter(([,v])=>v));