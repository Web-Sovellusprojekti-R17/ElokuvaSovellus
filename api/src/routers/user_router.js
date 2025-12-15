import { Router } from "express";
import { getUsers, getUserByID, addUser, changeUsername, changePassword, deleteUser,deleteAccount, login, refreshAccessToken, logout } from "../controllers/user_controller.js";
import { authenticateToken } from "../utils/auth.js";
const userRouter = Router();

userRouter.get("/", authenticateToken, getUsers);
userRouter.get("/:id", authenticateToken, getUserByID);

userRouter.post("/login", login);
userRouter.post("/register", addUser);
userRouter.post("/logout", logout);
userRouter.post("/refresh", refreshAccessToken);

userRouter.put("/name/:id", authenticateToken, changeUsername);
userRouter.put("/password/:id", authenticateToken, changePassword);
userRouter.put("/date/:id", authenticateToken, deleteAccount);

userRouter.delete("/:id", authenticateToken, deleteUser);

export default userRouter;
