import { getAll, getOne, addOne, updateOne, deleteOne } from "../models/template_model.js";

///
// REST API implementointiin tarvitaan 4 eri fileä:
// template_controller.js <- current
// template_model.js
// template_router.js
// index.js
///


export async function getTemplates(req, res, next) {
  try {
    const templates = await getAll();
    res.json(templates);
  } catch (err) {
    next(err);
  }
}

export async function getTemplate(req, res, next) {
  try {
    const Template = await getOne(req.params.id)  ;
    if (!Template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.json(Template);
  } catch (err) {
    next(err);
  }
}

export async function addTemplate(req, res, next) {
  console.log("add called");
  try {
    console.log(req.body);
    const response = await addOne(req.body);
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function updateTemplate(req, res, next) {
  try {
    const response = await updateOne(req.params.id, req.body);
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function deleteTemplate(req, res, next) {
  try {
    const Template = await deleteOne(req.params.id);
    if (!Template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.json(Template);
  } catch (err) {
    next(err);
  }
}