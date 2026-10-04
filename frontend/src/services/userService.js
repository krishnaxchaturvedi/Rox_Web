import api from './api';
export const getUsers=p=>api.get('/admin/users',{params:p});
export const getUser=id=>api.get('/admin/users/'+id);
export const createUser=d=>api.post('/admin/users',d);
export const updateUser=(id,d)=>api.put('/admin/users/'+id,d);
export const deleteUser=id=>api.delete('/admin/users/'+id);