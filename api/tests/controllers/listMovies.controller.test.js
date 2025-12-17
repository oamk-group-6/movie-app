import {
  getMovies,
  addMovie,
  removeMovie,
} from '../../src/controllers/listMoviesController.js';

import * as listMoviesModel from '../../src/models/listMoviesModel.js';
import { mockReq, mockRes } from '../helpers/testUtils.js';

jest.mock('../../src/models/listMoviesModel.js');

describe('listMoviesController', () => {
  let req, res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    jest.clearAllMocks();
  });

  describe('getMovies', () => {
    it('returns movies in list', async () => {
      req.params = { list_id: '1' };
      listMoviesModel.getMoviesInList.mockResolvedValue([{ id: 10 }]);

      await getMovies(req, res);

      expect(listMoviesModel.getMoviesInList).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith([{ id: 10 }]);
    });

    it('returns 500 on error', async () => {
      req.params = { list_id: '1' };
      listMoviesModel.getMoviesInList.mockRejectedValue(new Error());

      await getMovies(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('addMovie', () => {
    it('adds movie to list', async () => {
      req.params = { list_id: '1' };
      req.body = { movie_id: 10, user_id: 1 };

      listMoviesModel.addMovieToList.mockResolvedValue({ movie_id: 10 });

      await addMovie(req, res);

      expect(listMoviesModel.addMovieToList)
        .toHaveBeenCalledWith('1', 10, 1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ movie_id: 10 });
    });

    it('returns 400 if required fields missing', async () => {
      req.params = { list_id: '1' };
      req.body = {};

      await addMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(listMoviesModel.addMovieToList).not.toHaveBeenCalled();
    });

    it('returns 409 if movie already exists', async () => {
      req.params = { list_id: '1' };
      req.body = { movie_id: 10, user_id: 1 };

      listMoviesModel.addMovieToList.mockResolvedValue(null);

      await addMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Movie already in list',
      });
    });
  });

  describe('removeMovie', () => {
    it('removes movie from list', async () => {
      req.params = { list_id: '1', movie_id: '10' };

      listMoviesModel.removeMovieFromList
        .mockResolvedValue({ movie_id: 10 });

      await removeMovie(req, res);

      expect(listMoviesModel.removeMovieFromList)
        .toHaveBeenCalledWith('1', '10');
      expect(res.json).toHaveBeenCalledWith({
        message: 'Movie removed',
        removed: { movie_id: 10 },
      });
    });

    it('returns 404 if movie not found', async () => {
      req.params = { list_id: '1', movie_id: '10' };

      listMoviesModel.removeMovieFromList.mockResolvedValue(null);

      await removeMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Movie not found in list',
      });
    });
  });
});
