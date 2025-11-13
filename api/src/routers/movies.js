import express from "express";
import { 
  getMovies, 
  getMovieById, 
  createMovie, 
  updateMovie, 
  deleteMovie,
  patchMovie 
} from "../controllers/moviesController.js";

const router = express.Router();

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", createMovie);
router.put("/:id", updateMovie);
router.patch("/:id", patchMovie);
router.delete("/:id", deleteMovie);

export default router;