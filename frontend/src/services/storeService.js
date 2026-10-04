import api from './api';
export const getStores=p=>api.get('/stores',{params:p});
export const getStore=id=>api.get('/stores/'+id);
export const getAdminStores=p=>api.get('/admin/stores',{params:p});