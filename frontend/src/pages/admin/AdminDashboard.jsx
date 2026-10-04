import{useEffect,useState}from'react';import{getAdminStats}from'../../services/adminService';import StatsCard from'../../components/admin/StatsCard';
export default function AdminDashboard(){const[s,setS]=useState(null),[e,setE]=useState('');
 useEffect(()=>{getAdminStats().then(r=>setS(r.data)).catch(x=>setE(x.response?.data?.message||'Unable to load dashboard.'))},[]);
 if(e)return <><h1>Admin Dashboard</h1><p className='error'>{e}</p></>;
 if(!s)return <><h1>Admin Dashboard</h1><p>Loading dashboard...</p></>;
 return <><h1>Admin Dashboard</h1><div className='grid grid3'><StatsCard label='Total users' value={s.users}/><StatsCard label='Total stores' value={s.stores}/><StatsCard label='Total ratings' value={s.ratings}/></div></>;
}