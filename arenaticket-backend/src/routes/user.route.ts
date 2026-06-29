import { Router } from "express";
import { login, register, updatePassword, updateProfile, whoami } from "../controllers/user.controller";
import { authorized } from "../middlewares/authorized.middleware";
import { upload } from "../middlewares/upload.middleware";

const userRoute = Router();

userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.get("/whoami", authorized, whoami);
userRoute.put("/update", authorized, upload.single("avatar"), updateProfile);
userRoute.put("/password", authorized, updatePassword);

export default userRoute;
