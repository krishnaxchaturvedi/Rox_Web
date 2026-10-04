import{useEffect,useState}from'react';import{getUsers,deleteUser}from'../../services/userService';import UserFilters from'../../components/admin/UserFilters';import UserTable from'../../components/admin/UserTable';import AddUserForm from'../../components/admin/AddUserForm';
export default function AdminUsers(){
 const[u,setU]=useState([]),[f,setF]=useState({search:'',role:'',sort:'name'}),[error,setError]=useState('');
 const load=()=>getUsers(f).then(r=>setU(r.data.users||[])).catch(e=>setError(e.response?.data?.message||'Unable to load users.'));
 useEffect(()=>{const t=setTimeout(load,250);return()=>clearTimeout(t)},[f]);
 const remove=async user=>{if(!window.confirm('Delete this user?'))return;try{setError('');await deleteUser(user.id);load()}catch(e){setError(e.response?.data?.message||'Unable to delete user.')}};
 return <><div className='page-header'><div><h1>Manage Users</h1><p className='page-subtitle'>Search, filter, inspect and manage real registered accounts.</p></div></div><div className='card'><UserFilters filters={f} onChange={setF}/></div>{error&&<p className='error'>{error}</p>}<div className='card' style={{marginTop:18}}><UserTable users={u} onDelete={remove}/></div><div className='card' style={{marginTop:18}}><h2>Add User</h2><p className='muted small'>Creates a real account in PostgreSQL with a hashed password.</p><AddUserForm onCreated={load}/></div></>;
}