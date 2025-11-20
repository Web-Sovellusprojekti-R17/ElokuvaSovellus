import { getAll, getOne, addOne, updateOne, deleteOne} from "../models/member_model.js";

import { ApiError } from "../helpers/ApiError.js";


export async function getMembers(req, res, next) {
  try {
    const members = await getAll();
    res.status(200).json(members);
  } catch (err) {
    next(err);
  }
}


export async function getMember(req, res, next) {
  const { group_id, user_id } = req.params;
  try {
    const member = await getOne(group_id, user_id);
    if (!member)
      return next(new ApiError("Member not found", 404));

    res.status(200).json(member);
  } catch (err) {
    next(err);
  }
}


export async function addMember(req, res, next) {
  const member = req.body;
  try {
    const response = await addOne(member);
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}


export async function updateMember(req, res, next) {
  const { group_id, user_id } = req.params;
  const updates = req.body;

  try {
    const response = await updateOne(group_id, user_id, updates);
    if (!response)
      return next(new ApiError("Member not found", 404));

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}


export async function deleteMember(req, res, next) {
  const { group_id, user_id } = req.params;

  try {
    const response = await deleteOne(group_id, user_id);
    if (!response)
      return next(new ApiError("Member not found", 404));

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}
