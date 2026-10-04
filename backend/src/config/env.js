import 'dotenv/config';
export const env={
 port:Number(process.env.PORT||5000),
 databaseUrl:process.env.DATABASE_URL,
 jwtSecret:process.env.JWT_SECRET,
 clientUrl:process.env.CLIENT_URL||'http://localhost:5173'
};
if(!env.databaseUrl)console.warn('DATABASE_URL is not configured.');
if(!env.jwtSecret)console.warn('JWT_SECRET is not configured.');