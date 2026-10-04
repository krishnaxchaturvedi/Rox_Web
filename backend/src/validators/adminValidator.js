const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const password=/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
export function validateUserInput({name,email:mail,password:pass,address='',role}={}, {passwordRequired=true}={}){
 const errors={};
 if(typeof name!=='string'||name.trim().length<20||name.trim().length>60)errors.name='Name must be 20-60 characters.';
 if(typeof mail!=='string'||!email.test(mail))errors.email='Enter a valid email.';
 if(typeof address!=='string'||address.length>400)errors.address='Address must be at most 400 characters.';
 if(passwordRequired&&(typeof pass!=='string'||!password.test(pass)))errors.password='Password must be 8-16 characters with at least one uppercase and one special character.';
 if(!['ADMIN','USER','OWNER'].includes(role))errors.role='Invalid role.';
 return errors;
}
export function validateStoreInput({name,address=''}={}){
 const errors={};
 if(typeof name!=='string'||!name.trim())errors.name='Store name is required.';
 if(typeof address!=='string'||address.length>400)errors.address='Address must be at most 400 characters.';
 return errors;
}