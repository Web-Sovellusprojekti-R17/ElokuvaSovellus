import {
    getAll,
    getOneByID,
    getOneByName,
    addOne,
    updatePassword,
    updateName,
    deleteOne,
    deleteSelf,
    updateDelete,
    saveRefreshToken,
    getUserByRefreshToken,
    clearRefreshToken
} from "../models/user_model.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { ApiError } from "../helpers/ApiError.js";
import { compare } from 'bcryptjs';

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
        if (!data.name || !data.password)
            return next(new ApiError("Required data missing", 400));
        const response = await addOne(data);
        res.status(201).json(response);
    } catch (err) {
        if (err.code === '23505') // PostgreSQL unique violation
            return res.status(409).json({ error: "Username already exists" });
        next(err);
    }
}

export async function login(req, res, next) {
    const data = req.body;
    try {
        if (!data.name || !data.password)
            return next(new ApiError("Required data missing", 400));

        const foundUser = await getOneByName(data.name);
        console.log("foundUser object:", foundUser); // <-- ADD THIS DEBUG LOG
        console.log("foundUser.user_id:", foundUser?.user_id); // <-- ADD THIS TOO

        
        if (!foundUser)
            return next(new ApiError("User not found", 404));

        const correctPassword = await compare(data.password, foundUser.password);

        if (!correctPassword)
            return next(new ApiError("Wrong password", 401));

        const accessToken = generateAccessToken(foundUser.username, foundUser.user_id);
        const refreshToken = generateRefreshToken(foundUser.username, foundUser.user_id);

        // Tallenna refresh token tietokantaan
        await saveRefreshToken(foundUser.username, refreshToken);
console.log(foundUser);
        // Aseta refresh token HTTP-only cookieen
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,                                 // Ei JavaScript-pääsyä
            secure: process.env.NODE_ENV === "production",  // HTTPS tuotannossa
            sameSite: "strict",                             // CSRF-suojaus
            maxAge: 7 * 24 * 60 * 60 * 1000,                // 7 päivää
        });

        res.status(200).json({
            message: "Login successful",
            username: foundUser.username,
            user_id: foundUser.user_id,
            accessToken
        });
    } catch (err) {
        next(err);
    }
}

// Kirjaudu ulos
export async function logout(req, res, next) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const user = await getUserByRefreshToken(refreshToken);

            if (user) {
                // Poista refresh token tietokannasta
                await clearRefreshToken(user.username);
            }
        }

        // Poista cookie
        res.clearCookie("refreshToken");

        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        next(err);
    }
}

// Päivitä access token
export async function refreshAccessToken(req, res, next) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken)
            return next(new ApiError("Refresh token required", 401));

        // Validoi refresh token
        const decoded = verifyRefreshToken(refreshToken);

        if (!decoded) {
            return next(new ApiError("Invalid or expired refresh token", 403));
        }

        // Tarkista että token on tietokannassa
        const user = await getUserByRefreshToken(refreshToken);

        if (!user) {
            return next(new ApiError("Invalid refresh token", 403));
        }

        // Luo uusi access token
        const accessToken = generateAccessToken(user.username, user.user_id);

        res.json({ accessToken });
    } catch (err) {
        next(err);
    }
}

export async function changeUsername(req, res, next) {
    const id = req.params.id;
    const data = req.body;

    try {
        if (!data.name)
            return next(new ApiError("Required data missing", 400));

        const updated = await updateName(id, data.name);

        if (!updated)
            return next(new ApiError("User not found", 404));

        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
}

export async function changePassword(req, res, next) {
    const id = req.params.id;
    const data = req.body;

    try {
        if (!data.oldPassword || !data.newPassword)
            return next(new ApiError("Required data missing", 400));

        if(data.oldPassword === data.newPassword)
            return next(new ApiError("New password must be different from old password", 400));

        const foundUser = await getOneByID(id);

        if (!foundUser)
            return next(new ApiError("User not found", 404));

        const correctPassword = await compare(data.oldPassword, foundUser.password)

        if (!correctPassword)
            return next(new ApiError("Wrong old password", 401));

        const updated = await updatePassword(id, data.newPassword);
        
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

export async function deleteAccount(req, res, next) {
    const data = req.body;
    const id = req.params.id;

    try {

        if (!data.password)
            return next(new ApiError("Required data missing", 400));

        const foundUser = await getOneByID(id);

        if (!foundUser)
            return next(new ApiError("User not found", 404));

        const correctPassword = await compare(data.password, foundUser.password)

        if (!correctPassword)
            return next(new ApiError("Wrong password", 401));

        const now = new Date();
        const deletionDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const updatedUser = { username: data.username, password: data.password, deletion_date: deletionDate }

        const updated = await updateDelete(id, updatedUser);
        if (!updated)
            return next(new ApiError("User not found", 404));

        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
}