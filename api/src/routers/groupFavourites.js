import express from "express";
import {
    createGroupFavourite,
    deleteGroupFavourite,
    getGroupFavouriteStatus,
    getGroupFavourites
} from "../controllers/groupFavouritesController.js";

const router = express.Router();

/* Get favourites for group */
router.get("/group/:groupId", getGroupFavourites);

/* Add favourite to group */
router.post("/group/:groupId", createGroupFavourite);

/* Remove favourite from group */
router.delete("/group/:groupId/:movieId", deleteGroupFavourite);

/* Check favourite status */
router.get("/group/:groupId/:movieId", getGroupFavouriteStatus);

export default router;
