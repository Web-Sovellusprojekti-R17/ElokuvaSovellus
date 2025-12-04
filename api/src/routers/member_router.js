import { Router } from "express";
import { getMembers, getMember, addMember, updateMember, deleteMember, getJasenet} from "../controllers/member_controller.js";

const membersRouter = Router();

membersRouter.get("/", getMembers);
membersRouter.get("/:id", getJasenet);
membersRouter.get("/:group_id/:user_id", getMember);
membersRouter.post("/", addMember);
membersRouter.put("/:group_id/:user_id", updateMember);
membersRouter.delete("/:group_id/:user_id", deleteMember);

export default membersRouter;
