export default function RatingSummary({distribution={}}){
 return <div className='card'>
  <h2>Rating distribution</h2>
  {[5,4,3,2,1].map(n=>{
   const item=distribution[n]||{count:0,percentage:0};
   return <div key={n} style={{display:'grid',gridTemplateColumns:'60px 1fr 70px',gap:10,alignItems:'center',margin:'10px 0'}}>
    <span>{n} ★</span>
    <div style={{background:'#e5e7eb',height:10,borderRadius:99,overflow:'hidden'}}><div style={{width:item.percentage+'%',height:'100%',background:'#f59e0b'}}/></div>
    <span>{item.count} ({item.percentage}%)</span>
   </div>;
  })}
 </div>;
}