import api from './api';
export const getUsers=p=>api.get('/admin/users',{params:p});
export const getUser=id=>api.get('/admin/users/'+id);
export const createUser=d=>api.post('/admin/users',d);