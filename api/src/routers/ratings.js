import express from "express";
import {
    rateMovie, 
    getUserRating,
    deleteUserRating
} from "../controllers/ratingsController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, rateMovie);
router.get("/:movieId", auth, getUserRating);
router.delete("/:movieId", auth, deleteUserRating);

export default router;


