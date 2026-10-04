import { query } from '../config/database.js';
export const listStores = async (search='') => (await query(`
SELECT s.id,s.name,s.email,s.address,s.owner_id,
COALESCE(ROUND(AVG(r.rating)::numeric,1),0) AS average_rating,
COUNT(r.id)::int AS rating_count
FROM stores s LEFT JOIN ratings r ON r.store_id=s.id
WHERE ($1='' OR s.name ILIKE '%'||$1||'%' OR s.address ILIKE '%'||$1||'%')
GROUP BY s.id ORDER BY s.name ASC`,[search])).rows;