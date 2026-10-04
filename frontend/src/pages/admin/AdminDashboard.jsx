import{useEffect,useState}from'react';import{getAdminStats}from'../../services/adminService';import StatsCard from'../../components/admin/StatsCard';
export default function AdminDashboard(){
 const[s,setS]=useState(null),[e,setE]=useState('');
 useEffect(()=>{getAdminStats().then(r=>setS(r.data)).catch(x=>setE(x.response?.data?.message||'Unable to load dashboard.'))},[]);
 return <><div className='page-header'><div><h1>Admin Dashboard</h1><p className='page-subtitle'>Live totals from the Rox database.</p></div></div>
 {e?<div className='card'><p className='error'>{e}</p></div>:!s?<div className='loading-state'><span className='spinner'/>Loading dashboard...</div>:<div className='grid grid3'><StatsCard label='Total users' value={s.users}/><StatsCard label='Total stores' value={s.stores}/><StatsCard label='Total ratings' value={s.ratings}/></div>}</>;
}