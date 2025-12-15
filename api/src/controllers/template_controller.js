import { getAll, getOne, addOne, updateOne, deleteOne } from "../models/template_model.js";
import { ApiError } from "../helpers/ApiError.js";


export async function getTemplates(req, res, next) {
  try {
    const templates = await getAll();
    res.status(200).json(templates);
  } catch (err) {
    next(err);
  }
}

export async function getTemplate(req, res, next) {
  const id = req.params.id;
  try {
    const template = await getOne(id);
    if (!template)
      return next(new ApiError("Template not found", 404));

    res.status(200).json(template);
  } catch (err) {
    next(err);
  }
}

export async function addTemplate(req, res, next) {
  console.log("add called");
  console.log(req.body);
  const template = req.body;
  try {
    const response = await addOne(template);
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

export async function updateTemplate(req, res, next) {
  const template = req.body;
  const id = req.params.id;
  try {
    const response = await updateOne(id, template);
    if(!response)
      return next(new ApiError("Template not found", 404));
    
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

export async function deleteTemplate(req, res, next) {
  try {
    const template = await deleteOne(req.params.id);
    if (!template)
      return next(new ApiError("Template not found", 404));

    res.status(200).json(template);
  } catch (err) {
    next(err);
  }
}