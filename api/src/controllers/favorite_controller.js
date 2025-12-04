import FavoriteModel from "../models/favorite_model.js";

export default {
    async add(req, res) {
        try {
            const { movie_id } = req.body;
            const user_id = req.user.user_id;

            const fav = await FavoriteModel.addFavorite(user_id, movie_id);
            res.json({ success: true, favorite: fav });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to add favorite" });
        }
    },

    async remove(req, res) {
        try {
            const { movie_id } = req.body;
            const user_id = req.user.user_id;

            await FavoriteModel.removeFavorite(user_id, movie_id);
            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to remove favorite" });
        }
    },

    async list(req, res) {
        try {
            const user_id = req.user.user_id;
            const favorites = await FavoriteModel.getFavorites(user_id);
            res.json({ favorites });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to get favorites" });
        }
    }
};
