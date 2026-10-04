import{useEffect,useState}from'react';
import{getStores}from'../../services/storeService';
import{saveRating}from'../../services/ratingService';
import StoreSearch from'../../components/user/StoreSearch';
import StoreTable from'../../components/user/StoreTable';

export default function Stores(){
 const[stores,setStores]=useState([]),[q,setQ]=useState(''),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const load=async()=>{
   setLoading(true);setError('');
   try{const r=await getStores({search:q});setStores(r.data.stores||[]);}
   catch(e){setError(e.response?.data?.message||'Unable to load stores.');}
   finally{setLoading(false);}
 };
 useEffect(()=>{const t=setTimeout(load,250);return()=>clearTimeout(t)},[q]);
 const rate=async(id,value)=>{
   try{
     await saveRating(id,value);
     await load();
   }catch(e){setError(e.response?.data?.message||'Unable to save rating.');}
 };
 return <><h1>Stores</h1><StoreSearch value={q} onChange={setQ}/>{loading?<p>Loading stores...</p>:error?<p className='error'>{error}</p>:stores.length?<StoreTable stores={stores} onRate={rate}/>:<div className='card'><p>No stores found.</p></div>}</>;
}