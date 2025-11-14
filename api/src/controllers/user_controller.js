import { getAll, getOneByID, getOneByName, addOne, updateOne, deleteOne } from "../models/user_model.js";
import { ApiError } from "../helpers/ApiError.js";
import { compare, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function getUsers(req, res, next) {
    try {
        const users = await getAll();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}

export async function getUserByID(req, res, next) {
    const id = req.params.id;
    try {
        const user = await getOneByID(id);
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
    const data = req.body;
    try {
        if(!data.name || !data.password)
            return next(new ApiError("Required data missing", 400));
        
        const hashedUser = {name: data.name, password: await hash(data.password, 10)}
        const response = await addOne(hashedUser);
        res.status(201).json(response);
    } catch (err) {
        next(err);
    }
}

// TODO: I think this needs to be in its own login file or something like that
export async function login(req, res, next) {
    const data = req.body;
    try {
        if(!data.name || !data.password)
            return next(new ApiError("Required data missing", 400));

        const foundUser = await getOneByName(data.name);

        if(!foundUser)
            return next(new ApiError("User not found", 404));

        const correctPassword = await compare(data.password, foundUser.password)
   
        if(!correctPassword)
            return next(new ApiError("Wrong password", 401));

        res.status(200).json({response: "Login success!"});
    } catch (err) {
        next(err);
    }
}

// TODO: This needs to be updated in the future to actually be useful aside from testing
export async function updateUser(req, res, next) {
    const id = req.params.id;
    const data = req.body;

    try {
        if(!data.name || !data.password)
            return next(new ApiError("Required data missing", 400));

        const updatedUser = {name: data.name, password: await hash(data.password, 10)}
        const updated = await updateOne(id, updatedUser);
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