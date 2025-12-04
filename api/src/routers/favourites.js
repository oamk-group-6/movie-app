import express from "express";
import {
    addFavouriteController,
    removeFavouriteController,
    getFavouritesController
} from "../controllers/favouritesController.js";

const router = express.Router();

router.get("/:userId", getFavouritesController);
router.post("/", addFavouriteController);
router.delete("/:userId/:movieId", removeFavouriteController);

export default router;
