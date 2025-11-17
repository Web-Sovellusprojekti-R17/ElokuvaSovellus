import { Router } from "express";
import { getUsers, getUserByID, addUser, updateUser, deleteUser, login } from "../controllers/user_controller.js";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/login", login);
userRouter.get("/:id", getUserByID);
userRouter.post("/", addUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
