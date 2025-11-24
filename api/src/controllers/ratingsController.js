import * as ratingsModel from "../models/ratingsModel.js"

export const rateMovie = async (req, res) => {
    try {
        const userId = req.user.id;
        const { movieId, rating, review } = req.body;

        if (rating < 0 || rating > 5) {
            return res.status(400).json({ error: "Rating must be between 0 and 5" });
        }

        const userRating = await ratingsModel.upsertRating(userId, movieId, rating, review);
        res.status(201).json({ message: "Rating saved", rating: userRating });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

export const getUserRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { movieId } = req.params;

        const rating = await ratingsModel.getUserRating(userId, movieId);
        if (!rating) return res.status(404).json({ error: "No rating found" });

        res.json(rating);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

export const deleteUserRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { movieId } = req.params;

        await ratingsModel.deleteRating(userId, movieId);
        res.json({message: "Rating deleted"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Database error"});
    }
};

export const getMovieRatings = async (req, res) => {
    try {
        const { movieId } = req.params;

        const ratings = await ratingsModel.getRatingsForMovie(movieId);

        res.json({
            movieId,
            count: ratings.length,
            ratings
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};
