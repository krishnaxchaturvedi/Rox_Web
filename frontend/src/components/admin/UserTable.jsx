import{Link}from'react-router-dom';
export default function UserTable({users=[],onDelete}){
 if(!users.length)return <p className='muted'>No users found.</p>;
 return <div style={{overflowX:'auto'}}><table className='table'><thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th><th>Actions</th></tr></thead>
 <tbody>{users.map(u=><tr key={u.id}><td><Link to={'/admin/users/'+u.id}>{u.name}</Link></td><td>{u.email}</td><td>{u.address}</td><td><span className='badge'>{u.role}</span></td><td>{onDelete&&<button className='btn secondary' onClick={()=>onDelete(u)}>Delete</button>}</td></tr>)}</tbody></table></div>;
}