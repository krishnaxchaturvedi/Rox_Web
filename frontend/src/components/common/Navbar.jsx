import {Link,useNavigate} from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {ROLE_LABELS} from '../../utils/constants';

export default function Navbar(){
 const{user,logout}=useAuth(),nav=useNavigate();
 const home=user?.role==='ADMIN'?'/admin':user?.role==='OWNER'?'/owner':'/user';
 return <nav className='nav'>
  <Link className='brand' to={user?home:'/login'}><span className='brand-mark'>R</span><span>Rox Store Ratings</span></Link>
  <div className='links'>
   {user?<><span className='nav-user'>{user.name} · {ROLE_LABELS[user.role]}</span><button className='btn secondary' onClick={()=>{logout();nav('/login')}}>Logout</button></>:<><Link to='/login'>Login</Link><Link className='btn' to='/signup'>Sign up</Link></>}
  </div>
 </nav>;
}
