import dotenv from "dotenv";

dotenv.config();

export const PORT = Number(process.env.PORT || 8089);
export const MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/arenaticket";
export const SECRET_KEY = process.env.SECRET_KEY || "merosecretkey";
