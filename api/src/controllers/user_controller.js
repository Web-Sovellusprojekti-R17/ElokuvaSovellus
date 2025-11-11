import { getAll, getOne, addOne, updateOne, deleteOne } from "../models/user_model.js";
import { ApiError } from "../helpers/ApiError.js";

export async function getUsers(req, res, next) {
    try {
        const users = await getAll();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}

export async function getUser(req, res, next) {
    const id = req.params.id;
    try {
        const user = await getOne(id);
        if (!user)
            return next(new ApiError("User not found", 404));

        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

export async function addUser(req, res, next) {
    console.log("add called");
    console.log(req.body);
    const user = req.body;
    try {
        if(!user.username || !user.password)
            return next(new ApiError("Required data missing", 400));
        // TODO: Hash the passwords 
        const response = await addOne(user);
        res.status(201).json(response);
    } catch (err) {
        next(err);
    }
}

export async function updateUser(req, res, next) {
    const id = req.params.id;
    const user = req.body;
    try {
        if(!user.username || !user.password)
            return next(new ApiError("Required data missing", 400));
        // TODO: Hash the passwords 
        const updated = await updateOne(id, user);
        if (!updated)
            return next(new ApiError("User not found", 404));

        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
}

export async function deleteUser(req, res, next) {
    try {
        const deleted = await deleteOne(req.params.id);
        if (!deleted)
            return next(new ApiError("User not found", 404));

        res.status(200).json(deleted);
    } catch (err) {
        next(err);
    }
}