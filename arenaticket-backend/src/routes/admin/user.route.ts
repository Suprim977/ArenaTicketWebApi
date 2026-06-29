import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../../controllers/admin/user.controller";
import { adminGuard } from "../../middlewares/admin.guard";
import { authorized } from "../../middlewares/authorized.middleware";

const adminUserRoute = Router();

adminUserRoute.use(authorized, adminGuard);
adminUserRoute.get("/", getAllUsers);
adminUserRoute.get("/:id", getUserById);
adminUserRoute.post("/", createUser);
adminUserRoute.put("/:id", updateUser);
adminUserRoute.delete("/:id", deleteUser);

export default adminUserRoute;
