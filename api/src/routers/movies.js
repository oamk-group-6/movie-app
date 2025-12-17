import express from "express";
import { 
  getMovies, 
  getMovieById, 
  createMovie, 
  updateMovie, 
  deleteMovie,
  patchMovie,
  getTopMovies,
  getNowPlayingMovies
} from "../controllers/moviesController.js";

const router = express.Router();

router.get("/top-rated", getTopMovies);
router.get("/now-playing", getNowPlayingMovies);
router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", createMovie);
router.put("/:id", updateMovie);
router.patch("/:id", patchMovie);
router.delete("/:id", deleteMovie);

export default router;