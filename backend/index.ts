import app from './app';
import { API_PORT } from './src/configs/constant';
import { connectToMongoDB } from './src/database/mongodb';

connectToMongoDB();

app.listen(API_PORT, () => {
  console.log(`Server running on http://localhost:${API_PORT}`);
});