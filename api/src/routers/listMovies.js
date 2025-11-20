import express from "express";
import {
  getMovies,
  addMovie,
  removeMovie
} from "../controllers/listMoviesController.js";

const router = express.Router();

router.get("/:list_id/movies", getMovies);
router.post("/:list_id/movies", addMovie);
router.delete("/:list_id/movies/:movie_id", removeMovie);

export default router;