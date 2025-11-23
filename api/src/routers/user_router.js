import { Router } from "express";
import { getUsers, getUserByID, addUser, updateUser, deleteUser,deleteAccount, login, refreshAccessToken, logout } from "../controllers/user_controller.js";
import { authenticateToken } from "../utils/auth.js";
const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", authenticateToken, getUserByID);

userRouter.put("/:id", updateUser);

userRouter.post("/login", login);
userRouter.post("/register", addUser);
userRouter.post("/refresh", refreshAccessToken);
userRouter.post("/logout", logout);

userRouter.put("/date/:id", deleteAccount);
userRouter.delete("/:id", deleteUser);
//userRouter.delete("/remove/:id", deleteAccount);

export default userRouter;
