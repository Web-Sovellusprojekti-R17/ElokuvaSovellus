import { getAll, getOne, addOne, updateOne, deleteOne } from "../models/message_model.js";
import { ApiError } from "../helpers/ApiError.js";

export async function getMessages(req, res, next) {
    try {
        const messages = await getAll();
        res.status(200).json(messages);
    } catch (err) {
        next(err);
    }
}

export async function getMessage(req, res, next) {
    const id = req.params.id;
    try {
        const message = await getOne(id);
        if (!message)
            return next(new ApiError("Message not found", 404));

        res.status(200).json(message);
    } catch (err) {
        next(err);
    }
}

export async function addMessage(req, res, next) {
    console.log("add called");
    console.log(req.body);
    const message = req.body;
    try {

        const response = await addOne(message);
        res.status(201).json(response);
    } catch (err) {
        next(err);
    }
}

export async function updateMessage(req, res, next) {
    const message = req.body;
    const id = req.params.id;
    try {
        const response = await updateOne(id, message);
        if (!response)
            return next(new ApiError("Message not found", 404));

        res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export async function deleteMessage(req, res, next) {
    try {
        const message = await deleteOne(req.params.id);
        if (!message)
            return next(new ApiError("Message not found", 404));

        res.status(200).json(message);
    } catch (err) {
        next(err);
    }
}