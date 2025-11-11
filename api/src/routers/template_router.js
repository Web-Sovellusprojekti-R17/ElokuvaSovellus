import { Router } from "express";
import { getTemplates, getTemplate, addTemplate, updateTemplate, deleteTemplate } from "../controllers/template_controller.js";

///
// REST API implementointiin tarvitaan 4 eri fileä:
// template_controller.js 
// template_model.js
// template_router.js <- current
// index.js
///

const templateRouter = Router();

templateRouter.get("/", getTemplates);
templateRouter.get("/:id", getTemplate);
templateRouter.post("/", addTemplate);
templateRouter.put("/:id", updateTemplate);
templateRouter.delete("/:id", deleteTemplate);

export default templateRouter;
