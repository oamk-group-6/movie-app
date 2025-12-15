import express from "express";
import {
    createGroupFavourite,
    deleteGroupFavourite,
    getGroupFavouriteStatus,
    getGroupFavourites
} from "../controllers/groupFavouritesController.js";
import {auth} from "../middleware/auth.js";

const router = express.Router();

/* Get favourites for group */
router.get("/group/:groupId", auth, getGroupFavourites);

/* Add favourite to group */
router.post("/group/:groupId", auth, createGroupFavourite);

/* Remove favourite from group */
router.delete("/group/:groupId/:movieId", auth, deleteGroupFavourite);

/* Check favourite status */
router.get("/group/:groupId/:movieId", auth, getGroupFavouriteStatus);

export default router;
