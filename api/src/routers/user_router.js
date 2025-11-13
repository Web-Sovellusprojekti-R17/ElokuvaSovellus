import { Router } from "express";
import { getUsers, getUser, addUser, updateUser, deleteUser } from "../controllers/user_controller.js";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", getUser);
userRouter.post("/", addUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
