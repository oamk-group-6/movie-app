import express from "express";
import {
    rateMovie, 
    getUserRating,
    deleteUserRating,
    getMovieRatings
} from "../controllers/ratingsController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, rateMovie);
router.get("/:movieId", auth, getUserRating);
router.delete("/:movieId", auth, deleteUserRating);
router.get("/movie/:movieId", getMovieRatings);

export default router;


