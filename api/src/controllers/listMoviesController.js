import * as listMoviesModel from "../models/listMoviesModel.js"

export const getMovies = async (req, res) => {
    try {
        const { list_id } = req.params;
        const movies = await listMoviesModel.getMoviesInList(list_id);
        res.json(movies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error"});
    }
};

export const addMovie = async (req, res) => {
  try {
    const { list_id } = req.params;
    const { movie_id, user_id } = req.body;

    if (!movie_id || !user_id) {
      return res.status(400).json({ error: "movie_id and user_id are required" });
    }

    const added = await listMoviesModel.addMovieToList(list_id, movie_id, user_id);

    if (!added) {
      return res.status(409).json({ error: "Movie already in list" });
    }

    res.status(201).json(added);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const removeMovie = async (req, res) => {
    try {
        const { list_id, movie_id } = req.params;

        const removed = await listMoviesModel.removeMovieFromList(list_id, movie_id);

        if (!removed) {
            return res.status(404).json({ error: "Movie not found in list"});
        }

        res.json({ message: "Movie removed", removed});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error"});
    }
};