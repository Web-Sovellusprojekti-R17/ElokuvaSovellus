import { getAll, getOne, addOne, updateOne, deleteOne, getOneGroup } from "../models/message_model.js";
import { ApiError } from "../helpers/ApiError.js";

export async function getMessages(req, res, next) {
    try {
        const messages = await getAll();
        res.status(200).json(messages);
    } catch (err) {
        next(err);
    }
}

export async function getMessagesOneGroup(req, res, next) {
    const id = req.params.group_id;
    try {
        const messages = await getOneGroup(id);
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
        const { text, user_id, group_id, movie_id, movie_title, movie_poster } = req.body;

        const message = await addOne({
            text,
            user_id,
            group_id,
            movie_id,
            movie_title,
            movie_poster
        });

        res.status(201).json(message);
    } catch (err) {
        next(err);
    }
}

export async function updateMessage(req, res, next) {
    const message = req.body;
    const id = req.params.id;
    try {
        if (!message.text || !message.user_id || !message.group_id)
            return next(new ApiError("Required data missing", 400));
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