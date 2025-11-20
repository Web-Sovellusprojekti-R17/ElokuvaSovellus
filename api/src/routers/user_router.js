import { Router } from "express";
import { getUsers, getUserByID, addUser, updateUser, deleteUser, login, refreshAccessToken, logout } from "../controllers/user_controller.js";
import { authenticateToken } from "../utils/auth.js";
const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", authenticateToken, getUserByID);

userRouter.put("/:id", updateUser);

userRouter.post("/login", login);
userRouter.post("/register", addUser);
userRouter.post("/refresh", refreshAccessToken);
userRouter.post("/logout", logout);

userRouter.delete("/:id", deleteUser);

export default userRouter;
