import { getAll, getOne,getOwn, addOne, updateOne, deleteOne } from "../models/group_model.js";
import { ApiError } from "../helpers/ApiError.js";

//
// REST API implementointiin tarvitaan 4 eri fileä:
// template_controller.js <- current
// template_model.js
// template_router.js
// index.js
//

export async function getGroups(req, res, next) {
  try {
    const group = await getAll();
    res.status(200).json(group);
  } catch (err) {
    next(err);
  }
}

export async function getGroup(req, res, next) {
  const id = req.params.id;
  try {
    const group = await getOne(id);
    if (!group)
      return next(new ApiError("Group not found", 404));

    res.status(200).json(group);
  } catch (err) {
    next(err);
  }
}

export async function getOwnGroups(req, res, next) {
  const id = req.params.id;
  try {
    const group = await getOwn(id);
    if (!group)
      return next(new ApiError("Group not found", 404));

    res.status(200).json(group);
  } catch (err) {
    next(err);
  }
}

export async function addGroup(req, res, next) {
  console.log("add called");
  console.log(req.body);
  const group = req.body;
  try {
    if(!group.group_name)
      return next(new ApiError("Required data missing", 400));  
  
    const response = await addOne(group);
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

export async function updateGroup(req, res, next) {
    const id = req.params.id;
    const group = req.body;
    try {
        if(!group.group_name)
            return next(new ApiError("Required data missing", 400));
        // TODO: Hash the passwords 
        const updated = await updateOne(id, group);
        if (!updated)
            return next(new ApiError("User not found", 404));

        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
}

export async function deleteGroup(req, res, next) {
  try {
    const deleted = await deleteOne(req.params.id);
    if (!deleted)
      return next(new ApiError("Group not found", 404));

    res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
}