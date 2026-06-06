import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const userRouter = Router();
const userController = new UserController();

userRouter.post('/register', userController.register.bind(userController));
userRouter.post('/login', userController.login.bind(userController));

export default userRouter;