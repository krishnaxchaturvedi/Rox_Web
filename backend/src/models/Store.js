import { query } from '../config/database.js';

export const listStores = async (search='', userId) => (await query(`
SELECT s.id,s.name,s.email,s.address,s.owner_id,
COALESCE(ROUND(AVG(r.rating)::numeric,1),0)::float AS "averageRating",
COUNT(r.id)::int AS "ratingCount",
MAX(CASE WHEN r.user_id=$2 THEN r.rating END) AS "myRating"
FROM stores s
LEFT JOIN ratings r ON r.store_id=s.id
WHERE ($1='' OR s.name ILIKE '%'||$1||'%' OR s.address ILIKE '%'||$1||'%')
GROUP BY s.id
ORDER BY s.name ASC`,[search,userId])).rows;