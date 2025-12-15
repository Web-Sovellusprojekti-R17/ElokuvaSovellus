import { Router } from "express";
import { getMessages, addMessage, updateMessage, deleteMessage, getMessagesOneGroup } from "../controllers/message_controller.js";

const messageRouter = Router();

messageRouter.get("/", getMessages);
messageRouter.get("/:group_id", getMessagesOneGroup);
messageRouter.post("/", addMessage);
messageRouter.put("/:id", updateMessage);
messageRouter.delete("/:id", deleteMessage);

export default messageRouter;
