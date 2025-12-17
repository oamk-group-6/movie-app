import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  patchMovie,
  deleteMovie,
  getTopMovies,
  getNowPlayingMovies
} from '../../src/controllers/moviesController.js';

import * as moviesModel from '../../src/models/moviesModel.js';
import { mockReq, mockRes } from '../helpers/testUtils.js';

jest.mock('../../src/models/moviesModel.js');

describe('moviesController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMovies', () => {
    it('should return movies with parsed filters', async () => {
      const req = mockReq({
        query: {
          genres: 'Action,Drama',
          yearFrom: '2000',
          ratingMin: '70',
          limit: '10',
          offset: '5',
          userId: '2'
        }
      });
      const res = mockRes();

      moviesModel.getAllMovies.mockResolvedValue([]);

      await getMovies(req, res);

      expect(moviesModel.getAllMovies).toHaveBeenCalledWith(
        expect.objectContaining({
          genres: ['Action', 'Drama'],
          yearFrom: 2000,
          ratingMin: 70,
          limit: 10,
          offset: 5
        }),
        2
      );

      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should use default pagination values', async () => {
      const req = mockReq();
      const res = mockRes();

      moviesModel.getAllMovies.mockResolvedValue([]);

      await getMovies(req, res);

      expect(moviesModel.getAllMovies).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 50,
          offset: 0
        }),
        null
      );
    });

    it('should return 500 on error', async () => {
      const req = mockReq();
      const res = mockRes();

      moviesModel.getAllMovies.mockRejectedValue(new Error());

      await getMovies(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getMovieById', () => {
    it('should return movie', async () => {
      const req = mockReq({ params: { id: '1' } });
      const res = mockRes();

      moviesModel.getMovieById.mockResolvedValue({ id: 1 });

      await getMovieById(req, res);

      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return 404 if not found', async () => {
      const req = mockReq({ params: { id: '1' } });
      const res = mockRes();

      moviesModel.getMovieById.mockResolvedValue(null);

      await getMovieById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createMovie', () => {
    it('should create movie', async () => {
      const req = mockReq({ body: { title: 'Movie' } });
      const res = mockRes();

      moviesModel.addMovie.mockResolvedValue({ id: 1 });

      await createMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('updateMovie', () => {
    it('should update movie', async () => {
      const req = mockReq({ params: { id: '1' }, body: {} });
      const res = mockRes();

      moviesModel.updateMovie.mockResolvedValue({});

      await updateMovie(req, res);

      expect(res.json).toHaveBeenCalled();
    });

    it('should return 404 if not found', async () => {
      const req = mockReq({ params: { id: '1' } });
      const res = mockRes();

      moviesModel.updateMovie.mockResolvedValue(null);

      await updateMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('patchMovie', () => {
    it('should patch movie', async () => {
      const req = mockReq({ params: { id: '1' }, body: { title: 'New' } });
      const res = mockRes();

      moviesModel.patchMovie.mockResolvedValue({});

      await patchMovie(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('deleteMovie', () => {
    it('should delete movie', async () => {
      const req = mockReq({ params: { id: '1' } });
      const res = mockRes();

      moviesModel.deleteMovie.mockResolvedValue({ id: 1 });

      await deleteMovie(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Movie deleted',
        movie: { id: 1 }
      });
    });
  });

  describe('getTopMovies', () => {
    it('should return top movies with default limit', async () => {
      const req = mockReq();
      const res = mockRes();

      moviesModel.getTopRatedMovies.mockResolvedValue([]);

      await getTopMovies(req, res);

      expect(moviesModel.getTopRatedMovies).toHaveBeenCalledWith(5);
    });
  });

  describe('getNowPlayingMovies', () => {
    it('should return now playing movies', async () => {
      const req = mockReq({ query: { limit: '20' } });
      const res = mockRes();

      moviesModel.getNowPlayingMovies.mockResolvedValue([]);

      await getNowPlayingMovies(req, res);

      expect(moviesModel.getNowPlayingMovies).toHaveBeenCalledWith(20);
    });
  });
});