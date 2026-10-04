import{useEffect,useState}from'react';
import{getOwnerDashboard}from'../../services/ownerService';
import OwnerStats from'../../components/owner/OwnerStats';
import RatingSummary from'../../components/owner/RatingSummary';
import RatingUsersTable from'../../components/owner/RatingUsersTable';

export default function OwnerDashboard(){
 const[data,setData]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
 useEffect(()=>{
  getOwnerDashboard()
   .then(r=>setData(r.data))
   .catch(e=>setError(e.response?.data?.message||'Unable to load owner dashboard.'))
   .finally(()=>setLoading(false));
 },[]);
 if(loading)return <><h1>Store Owner Dashboard</h1><p>Loading dashboard...</p></>;
 if(error)return <><h1>Store Owner Dashboard</h1><div className='card'><p className='error'>{error}</p></div></>;
 return <div>
  <h1>Store Owner Dashboard</h1>
  <div className='card' style={{marginBottom:18}}>
   <h2>{data.store.name}</h2><p className='muted'>{data.store.address}</p>
  </div>
  <OwnerStats averageRating={data.averageRating} totalRatings={data.totalRatings}/>
  <div style={{marginTop:18}}><RatingSummary distribution={data.distribution}/></div>
  <div className='card' style={{marginTop:18}}>
   <h2>Users who rated your store</h2>
   <RatingUsersTable ratings={data.ratings}/>
  </div>
 </div>;
}