import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRoutes from './src/routes/user.route';
import { ApiResponseHelper } from './src/utils/apihelper.util';
import { HttpException } from './src/exceptions/http-exception';

const app: Application = express();

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', userRoutes);

app.use((req: Request, res: Response) => {
  return res.status(404).json({ message: 'API endpoint not found' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  if (err instanceof HttpException) {
    return ApiResponseHelper.error(res, err.message, err.status);
  }
  return ApiResponseHelper.error(res, 'Internal Server Error', 500);
});

export default app;