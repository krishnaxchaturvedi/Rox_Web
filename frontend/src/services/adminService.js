import api from './api';
export const getAdminStats=()=>api.get('/admin/stats');
export const getAdminStores=params=>api.get('/admin/stores',{params});
export const createStore=data=>api.post('/admin/stores',data);
export const updateStore=(id,data)=>api.put('/admin/stores/'+id,data);
export const deleteStore=id=>api.delete('/admin/stores/'+id);