import api from './api';
export const login=d=>api.post('/auth/login',d);
export const signup=d=>api.post('/auth/signup',d);
export const getMe=()=>api.get('/auth/me');
export const changePassword=d=>api.post('/auth/change-password',d);