import * as moviesModel from "../models/moviesModel.js";

export const getMovies = async (req, res) => {
  try {
    const { genre, year, limit = 50, offset = 0 } = req.query;
    const movies = await moviesModel.getAllMovies({ genre, year, limit, offset });
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await moviesModel.getMovieById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const createMovie = async (req, res) => {
  try {
    const newMovie = await moviesModel.addMovie(req.body);
    res.status(201).json(newMovie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const updatedMovie = await moviesModel.updateMovie(req.params.id, req.body);
    if (!updatedMovie) return res.status(404).json({ error: "Movie not found" });
    res.json(updatedMovie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const deletedMovie = await moviesModel.deleteMovie(req.params.id);
    if (!deletedMovie) return res.status(404).json({ error: "Movie not found" });
    res.json({ message: "Movie deleted", movie: deletedMovie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};