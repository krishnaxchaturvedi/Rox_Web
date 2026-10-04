import {createContext,useEffect,useState} from 'react';
import {login as loginApi,getMe} from '../services/authService';

export const AuthContext=createContext(null);

export function AuthProvider({children}){
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const saved=localStorage.getItem('rox_user');
    const token=localStorage.getItem('rox_token');
    if(!token){setLoading(false);return;}
    if(saved){try{setUser(JSON.parse(saved));}catch{localStorage.removeItem('rox_user');}}
    getMe()
      .then(r=>{const next=r.data.user;localStorage.setItem('rox_user',JSON.stringify(next));setUser(next);})
      .catch(()=>{localStorage.removeItem('rox_token');localStorage.removeItem('rox_user');setUser(null);})
      .finally(()=>setLoading(false));
  },[]);

  const login=async d=>{
    setLoading(true);
    try{
      const r=await loginApi(d);
      localStorage.setItem('rox_token',r.data.token);
      localStorage.setItem('rox_user',JSON.stringify(r.data.user));
      setUser(r.data.user);
      return r.data;
    }finally{setLoading(false);}
  };

  const logout=()=>{localStorage.removeItem('rox_token');localStorage.removeItem('rox_user');setUser(null);};
  return <AuthContext.Provider value={{user,loading,login,logout,isAuthenticated:!!user}}>{children}</AuthContext.Provider>;
}