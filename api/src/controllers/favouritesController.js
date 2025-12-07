import * as favouritesModel from "../models/favouritesModel.js";

export async function addFavouriteController(req, res) {
    const { userId, movieId } = req.body;
    const favourite = await favouritesModel.addFavourite(userId, movieId);
    res.json(favourite);
}

export async function removeFavouriteController(req, res) {
    const { userId, movieId } = req.params;
    await favouritesModel.removeFavourite(userId, movieId);
    res.json({ success: true });
}

export async function getFavouritesController(req, res) {
    const { userId } = req.params;
    const favourites = await favouritesModel.getFavouritesByUser(userId);
    res.json(favourites);
}
