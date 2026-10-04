const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export function validateSignup(body){
  const errors = {};
  if(!body.name || body.name.trim().length < 20 || body.name.trim().length > 60) errors.name='Name must be 20-60 characters.';
  if(!body.email || !emailRegex.test(body.email)) errors.email='Enter a valid email.';
  if(!body.password || !passwordRegex.test(body.password)) errors.password='Password must be 8-16 characters with uppercase and special character.';
  if(body.address && body.address.length > 400) errors.address='Address must be at most 400 characters.';
  return errors;
}
export function validateLogin(body){
  const errors={};
  if(!body.email || !emailRegex.test(body.email)) errors.email='Enter a valid email.';
  if(!body.password) errors.password='Password is required.';
  return errors;
}
export function validatePassword(password){
  return passwordRegex.test(password);
}