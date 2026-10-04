import { query } from '../config/database.js';
export const findUserByEmail = async (email) => (await query('SELECT * FROM users WHERE email=$1',[email])).rows[0];
export const findUserById = async (id) => (await query('SELECT id,name,email,address,role,created_at FROM users WHERE id=$1',[id])).rows[0];
export const createUser = async ({name,email,address,passwordHash,role='USER'}) => (await query('INSERT INTO users(name,email,address,password_hash,role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,address,role',[name,email,address||'',passwordHash,role])).rows[0];