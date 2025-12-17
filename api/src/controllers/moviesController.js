import * as moviesModel from "../models/moviesModel.js";

export const getMovies = async (req, res) => {
  try {
    const {
      search,
      genres,
      yearFrom,
      yearTo,
      language,
      country,
      ratingMin,
      ratingMax,
      limit,
      offset
    } = req.query;

    let genresArray;
    if (genres) {
      genresArray = Array.isArray(genres) ? genres : genres.split(",").map(g => g.trim());
    }

    const filters = {
      search: search || undefined,
      genres: genresArray,
      yearFrom: yearFrom ? parseInt(yearFrom, 10) : undefined,
      yearTo: yearTo ? parseInt(yearTo, 10) : undefined,
      language: language || undefined,
      country: country || undefined,
      ratingMin: ratingMin ? parseFloat(ratingMin) : undefined,
      ratingMax: ratingMax ? parseFloat(ratingMax) : undefined,
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0
    };

    // userId optional
    const userId = req.query.userId ? parseInt(req.query.userId, 10) : null;

    const movies = await moviesModel.getAllMovies(filters, userId);
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

export const patchMovie = async (req, res) => {
  try {
    const updated = await moviesModel.patchMovie(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Movie not found or no fields provided" });
    res.json(updated);
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

export const getTopMovies = async (req, res) => {
  const limit = Number(req.query.limit) || 5;

  try {
    const movies = await moviesModel.getTopRatedMovies(limit);
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

export const getNowPlayingMovies = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 40;

    const movies = await moviesModel.getNowPlayingMovies(limit);
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}
