import express from 'express';
import cors from 'cors';
import path from 'path';
import userRoutes from './routes/user.route';
import adminUserRoutes from './routes/admin/user.route';

const app = express();

// CORS Configuration
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Static Files - Safely resolve uploads path
const uploadPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadPath));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/admin/users', adminUserRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({ success: false, message: err.message || 'Internal Server Error' });
});

export default app;