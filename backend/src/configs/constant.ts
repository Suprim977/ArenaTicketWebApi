import dotenv from 'dotenv';
dotenv.config();

export const MONGODB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/arenaticket';
export const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey123';
export const API_PORT = process.env.PORT || 5000;