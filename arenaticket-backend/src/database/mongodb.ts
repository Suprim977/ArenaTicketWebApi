import mongoose from "mongoose";
import { MONGODB_URL } from "../configs/constant";

const dropLegacyUsernameIndex = async (): Promise<void> => {
  const db = mongoose.connection.db;

  if (!db) {
    return;
  }

  const usersCollection = db.collection("users");
  const indexes = await usersCollection.indexes();
  const hasLegacyUsernameIndex = indexes.some((index) => index.name === "username_1");

  if (hasLegacyUsernameIndex) {
    await usersCollection.dropIndex("username_1");
    console.log("Dropped legacy users.username_1 index");
  }
};

export const connectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URL);
    await dropLegacyUsernameIndex();
    console.log("ArenaTicket database connected");
  } catch (error) {
    console.error("ArenaTicket database connection failed", error);
    process.exit(1);
  }
};
