export default function UserFilters({filters,onChange}){
 return <div className='grid grid3'>
  <input className='input' placeholder='Search name, email or address' value={filters.search} onChange={e=>onChange({...filters,search:e.target.value})}/>
  <select className='input' value={filters.role} onChange={e=>onChange({...filters,role:e.target.value})}><option value=''>All roles</option><option value='USER'>Normal User</option><option value='OWNER'>Store Owner</option><option value='ADMIN'>System Administrator</option></select>
  <select className='input' value={filters.sort} onChange={e=>onChange({...filters,sort:e.target.value})}><option value='name'>Name</option><option value='email'>Email</option><option value='address'>Address</option><option value='role'>Role</option><option value='created_at'>Created date</option></select>
 </div>;
}