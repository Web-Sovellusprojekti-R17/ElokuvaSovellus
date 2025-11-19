import { Router } from "express";
import { getMessages, getMessage, addMessage, updateMessage, deleteMessage } from "../controllers/message_controller.js";

const messageRouter = Router();

messageRouter.get("/", getmessages);
messageRouter.get("/:id", getmessage);
messageRouter.post("/", addmessage);
messageRouter.put("/:id", updatemessage);
messageRouter.delete("/:id", deletemessage);

export default messageRouter;
