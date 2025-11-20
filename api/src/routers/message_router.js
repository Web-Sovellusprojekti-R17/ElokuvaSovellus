import { Router } from "express";
import { getMessages, getMessage, addMessage, updateMessage, deleteMessage } from "../controllers/message_controller.js";

const messageRouter = Router();

messageRouter.get("/", getMessages);
messageRouter.get("/:id", getMessage);
messageRouter.post("/", addMessage);
messageRouter.put("/:id", updateMessage);
messageRouter.delete("/:id", deleteMessage);

export default messageRouter;
