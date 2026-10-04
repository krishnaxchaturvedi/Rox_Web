import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;
export const pool = new Pool({ connectionString: env.databaseUrl, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false });

export const query = (text, params) => pool.query(text, params);