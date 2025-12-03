import { Router } from "express";
import { getGroups, getGroup, getOwnGroups, addGroup, updateGroup, deleteGroup } from "../controllers/group_controller.js";

///
// REST API implementointiin tarvitaan 4 eri fileä:
// group_controller.js 
// Group_model.js
// Group_router.js <- current
// index.js
///

const groupRouter = Router();

groupRouter.get("/", getGroups);
groupRouter.get("/:id", getGroup);
groupRouter.get("/own/:id", getOwnGroups);
groupRouter.post("/", addGroup);
groupRouter.put("/:id", updateGroup);
groupRouter.delete("/:id", deleteGroup);

export default groupRouter;
