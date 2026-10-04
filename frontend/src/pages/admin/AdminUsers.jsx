import{useEffect,useState}from'react';import{getUsers,deleteUser}from'../../services/userService';import UserFilters from'../../components/admin/UserFilters';import UserTable from'../../components/admin/UserTable';import AddUserForm from'../../components/admin/AddUserForm';
export default function AdminUsers(){
 const[u,setU]=useState([]),[f,setF]=useState({search:'',role:'',sort:'name'}),[error,setError]=useState('');
 const load=()=>getUsers(f).then(r=>setU(r.data.users||[])).catch(e=>setError(e.response?.data?.message||'Unable to load users.'));
 useEffect(()=>{const t=setTimeout(load,250);return()=>clearTimeout(t)},[f]);
 const remove=async user=>{if(!window.confirm('Delete this user?'))return;try{await deleteUser(user.id);load()}catch(e){setError(e.response?.data?.message||'Unable to delete user.')}};
 return <><h1>Manage Users</h1><div className='card'><UserFilters filters={f} onChange={setF}/></div>{error&&<p className='error'>{error}</p>}<div className='card' style={{marginTop:18}}><UserTable users={u} onDelete={remove}/></div><div className='card' style={{marginTop:18}}><h2>Add User</h2><AddUserForm onCreated={load}/></div></>;
}