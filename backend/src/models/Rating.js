import { query } from '../config/database.js';
export const upsertRating = async ({userId,storeId,rating}) => (await query(`
INSERT INTO ratings(user_id,store_id,rating) VALUES($1,$2,$3)
ON CONFLICT(user_id,store_id) DO UPDATE SET rating=EXCLUDED.rating,updated_at=NOW()
RETURNING id,user_id,store_id,rating,updated_at`,[userId,storeId,rating])).rows[0];