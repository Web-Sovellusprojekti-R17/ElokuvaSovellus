import { Router } from "express";
import { getUsers, getUserByID, addUser, updateUser, deleteUser, login,deleteAccount } from "../controllers/user_controller.js";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/login", login);
userRouter.get("/:id", getUserByID);
userRouter.post("/", addUser);
userRouter.put("/:id", updateUser);
userRouter.put("/date/:id", deleteAccount);
userRouter.delete("/:id", deleteUser);
//userRouter.delete("/remove/:id", deleteAccount);

export default userRouter;
