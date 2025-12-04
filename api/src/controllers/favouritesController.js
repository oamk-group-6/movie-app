/*import * as favouritesModel from "../models/favouritesModel.js";

export const addFavourite = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { movieId } = req.body;

        const fav = await favouritesModel.addFavourite(userId, movieId);
        res.status(201).json({ message: "Added to favourites", favourite: fav });
    } catch (err) {
        console.error("ERROR addFavourite:", err);
        res.status(500).json({ error: "Database error" });
    }
};

export const removeFavourite = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { movieId } = req.params;

        await favouritesModel.removeFavourite(userId, movieId);
        res.json({ message: "Removed from favourites" });
    } catch (err) {
        console.error("ERROR removeFavourite:", err);
        res.status(500).json({ error: "Database error" });
    }
};

export const getUserFavourites = async (req, res) => {
    try {
        const userId = req.user.userId;
        const favourites = await favouritesModel.getUserFavourites(userId);

        res.json(favourites);
    } catch (err) {
        console.error("ERROR getUserFavourites:", err);
        res.status(500).json({ error: "Database error" });
    }
};

export const checkFavourite = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { movieId } = req.params;

        const isFav = await favouritesModel.isFavourite(userId, movieId);
        res.json({ favourite: isFav });
    } catch (err) {
        console.error("ERROR checkFavourite:", err);
        res.status(500).json({ error: "Database error" });
    }
};*/
