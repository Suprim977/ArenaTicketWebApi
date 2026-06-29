import app from "./app";
import { PORT } from "./configs/constant";
import { connectMongoDB } from "./database/mongodb";

const startServer = async (): Promise<void> => {
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`ArenaTicket server running on port ${PORT}`);
  });
};

void startServer();
