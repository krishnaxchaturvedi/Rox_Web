import{RATINGS}from'../../utils/constants';
export default function RatingInput({value=0,onChange,disabled=false}){
 return <div className='rating-stars' aria-label='Choose rating'>
  {RATINGS.map(n=><button className={'rating-star'+(n>value?' muted':'')} disabled={disabled} type='button' key={n} aria-label={n+' out of 5'} onClick={()=>onChange(n)}>★</button>)}
 </div>;
}