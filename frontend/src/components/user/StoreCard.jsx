import RatingInput from'./RatingInput';
export default function StoreCard({store,onRate}){
 return <div className='card'>
  <h3>{store.name}</h3><p className='muted'>{store.address}</p>
  <p>Overall rating: <b>{Number(store.averageRating||0).toFixed(1)}</b> ({store.ratingCount||0} ratings)</p>
  <p>Your rating: <b>{store.myRating??'Not rated'}</b></p>
  <RatingInput value={Number(store.myRating||0)} onChange={v=>onRate(store.id,v)}/>
 </div>;
}