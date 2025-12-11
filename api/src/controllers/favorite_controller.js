import { isFavorite, addFavorite, removeFavorite, getFavoritesForUser, getAll } from "../models/favorite_model.js";
import { ApiError } from "../helpers/ApiError.js";
import { decryptToken } from "../utils/shareToken.js";

export async function getFavorites(req, res, next) {
    try {
        const favorites = await getAll();
        res.status(200).json(favorites);
    } catch (err) {
        console.error(err);
        return next(new ApiError("Failed to get favorites", 500));
    }
}

export async function toggleFavorite(req, res, next) {
    const data = req.body;
    try {
        if (!data.movie_id || !data.user_id)
            return next(new ApiError("Required data missing", 400));

        const isFav = await isFavorite(data.user_id, data.movie_id);

        if (isFav) {
            const removed = await removeFavorite(data.user_id, data.movie_id);
            console.log("Favorite removed");
            return res.status(201).json(removed);
        }

        const fav = await addFavorite(data.user_id, data.movie_id);
        console.log("Favorite added");

        res.status(201).json(fav);
    } catch (err) {
        return next(new ApiError("Failed to add favorite", 500));
    }
}

export async function getByUserID(req, res, next) {
    const id = req.params.id;
    try {
        const favorites = await getFavoritesForUser(id);
        res.status(200).json(favorites);
    } catch (err) {
        console.error(err);
        return next(new ApiError("Failed to get favorites", 500));
    }
}

export async function getPublicFavorites(req, res, next) {
    const { token } = req.params;
    try {
        const userId = decryptToken(token);

        if (!userId) {
            return next(new ApiError("Invalid share token", 400));
        }

        const favorites = await getFavoritesForUser(userId);
        res.status(200).json(favorites);
    } catch (err) {
        console.error(err);
        return next(new ApiError("Failed to get public favorites", 500));
    }
}

export async function getIsFavorite(req, res, next) {
   const data = req.body;
    try {
        if (!data.movie_id || !data.user_id)
            return next(new ApiError("Required data missing", 400));

        const isFav = await isFavorite(data.user_id, data.movie_id);

        res.status(200).json(isFav);
    } catch (err) {
        console.error(err);
        return next(new ApiError("Failed to get favorites", 500));
    }
}


