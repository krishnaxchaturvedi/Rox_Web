import{useEffect,useState}from'react';import{Link,useParams}from'react-router-dom';import{getUser}from'../../services/userService';
export default function AdminUserDetails(){
 const{id}=useParams(),[u,setU]=useState(null),[e,setE]=useState('');
 useEffect(()=>{getUser(id).then(r=>setU(r.data)).catch(x=>setE(x.response?.data?.message||'Unable to load user.'))},[id]);
 if(e)return <><div className='page-header'><div><h1>User Details</h1></div></div><div className='card'><p className='error'>{e}</p><Link className='btn secondary' to='/admin/users'>Back to users</Link></div></>;
 if(!u)return <div className='loading-state'><span className='spinner'/>Loading user...</div>;
 return <><div className='page-header'><div><h1>User Details</h1><p className='page-subtitle'>Account information from the database.</p></div><Link className='btn secondary' to='/admin/users'>Back to users</Link></div><div className='card'><div className='grid grid2'><div><span className='muted small'>Name</span><p><b>{u.name}</b></p></div><div><span className='muted small'>Email</span><p>{u.email}</p></div><div><span className='muted small'>Address</span><p>{u.address||'—'}</p></div><div><span className='muted small'>Role</span><p><span className='badge'>{u.role}</span></p></div></div></div></>;
}