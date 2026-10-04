import {NavLink}from'react-router-dom';
export default function Sidebar({links}){
 return <aside className='sidebar card'>
  <nav className='side-nav'>{links.map(x=><NavLink key={x.to} end={x.to==='/'||x.to.endsWith('/admin')||x.to==='/user'||x.to==='/owner'} to={x.to} className={({isActive})=>'side-link'+(isActive?' active':'')}>{x.label}</NavLink>)}</nav>
 </aside>;
}
