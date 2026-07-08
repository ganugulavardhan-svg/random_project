import {config} from 'dotenv';
config();


export const PORT = process.env.PORT || 3000; 
export const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
export const SESSION_SECRET = process.env.SESSION_SECRET || 'default-secret';
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';