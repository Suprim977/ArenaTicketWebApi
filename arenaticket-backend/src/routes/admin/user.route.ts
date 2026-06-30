import { Router } from 'express';
import {
  getAllUsersController, getUserByIdController, createUserController,
  updateUserController, deleteUserController
} from '../../controllers/admin/user.controller';
import { authorizedMiddleware } from '../../middlewares/authorized.middleware';
import { adminGuard } from '../../middlewares/admin.guard';

const router = Router();

// Apply auth + admin guard to ALL routes in this file
router.use(authorizedMiddleware, adminGuard);

router.get('/', getAllUsersController);
router.get('/:id', getUserByIdController);
router.post('/', createUserController);
router.put('/:id', updateUserController);
router.patch('/:id', updateUserController); // Support PATCH as well
router.delete('/:id', deleteUserController);

export default router;