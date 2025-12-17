import * as ratingsModel from "../models/ratingsModel.js"

export const rateMovie = async (req, res) => {
    try {
        const userId = req.user.userId;
        const movieId = Number(req.body.movieId);
        const rating = Number(req.body.rating);
        const review = req.body.review;

        if (rating < 0 || rating > 100) {
            return res.status(400).json({ error: "Rating must be between 0 and 100" });
        }

        if (!Number.isInteger(movieId)) {
            return res.status(400).json({ error: "Invalid movieId" });
        }

        if (typeof rating !== "number" || rating < 0 || rating > 100) {
            return res.status(400).json({ error: "Invalid rating" });
        }

        if (typeof review !== "string" || review.trim().length === 0) {
            return res.status(400).json({ error: "Review cannot be empty" });
        }

        if (review.length > 1000) {
            return res.status(400).json({ error: "Review too long" });
        }


        const userRating = await ratingsModel.upsertRating(userId, movieId, rating, review);
        res.status(201).json({ message: "Rating saved", rating: userRating });
    } catch (err) {
        console.error("ERROR in rateMovie:", err);
        res.status(500).json({ error: "Database error" });
    }
};

export const getUserRating = async (req, res) => {
    try {
        const userId = req.user.userId;
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
        const userId = req.user.userId;
        const { movieId } = req.params;

        await ratingsModel.deleteRating(userId, movieId);
        res.json({ message: "Rating deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

export const getMovieRatings = async (req, res) => {
    try {
        const { movieId } = req.params;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const offset = (page - 1) * limit;

        const ratings = await ratingsModel.getRatingsForMovie(movieId, limit, offset);
        const totalCount = await ratingsModel.getRatingCount(movieId);

        res.json({
            movieId,
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            ratings
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

export const getRatingAverages = async (req, res) => {
    try {
        const movieId = Number(req.params.movieId);
        if (isNaN(movieId)) return res.status(400).json({ error: "Invalid movieId" });

        const avg = await ratingsModel.getRatingAvg(movieId);

        return res.json({
            movieId,
            average: avg ?? 0
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
}