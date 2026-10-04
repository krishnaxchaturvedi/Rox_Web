export default function RatingUsersTable({ratings=[]}){
 if(!ratings.length)return <p className='muted'>No users have rated this store yet.</p>;
 return <div style={{overflowX:'auto'}}><table className='table'>
  <thead><tr><th>User</th><th>Email</th><th>Rating</th><th>Last updated</th></tr></thead>
  <tbody>{ratings.map(r=><tr key={r.id}><td>{r.user_name}</td><td>{r.user_email}</td><td>{r.rating} / 5</td><td>{new Date(r.updated_at).toLocaleDateString()}</td></tr>)}</tbody>
 </table></div>;
}