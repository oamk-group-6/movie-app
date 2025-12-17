import {
  rateMovie,
  getUserRating,
  deleteUserRating,
  getMovieRatings,
  getRatingAverages,
} from '../../src/controllers/ratingsController.js';

import * as ratingsModel from '../../src/models/ratingsModel.js';
import { mockReq, mockRes } from '../helpers/testUtils.js';

jest.mock('../../src/models/ratingsModel.js');

describe('ratingsController', () => {
  let req, res;

  beforeEach(() => {
    req = mockReq({
      user: { userId: 1 },
    });
    res = mockRes();
    jest.clearAllMocks();
  });

  describe('rateMovie', () => {
    it('saves rating', async () => {
      req.body = { movieId: 1, rating: 80, review: 'Great' };
      ratingsModel.upsertRating.mockResolvedValue({ rating: 80 });

      await rateMovie(req, res);

      expect(ratingsModel.upsertRating).toHaveBeenCalledWith(
        1,
        1,
        80,
        'Great'
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Rating saved',
        rating: { rating: 80 },
      });
    });

    it('rejects rating below 0', async () => {
      req.body = { movieId: 1, rating: -1 };

      await rateMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Rating must be between 0 and 100',
      });
      expect(ratingsModel.upsertRating).not.toHaveBeenCalled();
    });

    it('rejects rating above 100', async () => {
      req.body = { movieId: 1, rating: 200 };

      await rateMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(ratingsModel.upsertRating).not.toHaveBeenCalled();
    });

    it('returns 500 on db error', async () => {
      req.body = { movieId: 1, rating: 80, review: 'Great movie' };
      ratingsModel.upsertRating.mockRejectedValue(new Error());

      await rateMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('getUserRating', () => {
    it('returns user rating', async () => {
      req.params = { movieId: '1' };
      ratingsModel.getUserRating.mockResolvedValue({ rating: 80 });

      await getUserRating(req, res);

      expect(ratingsModel.getUserRating).toHaveBeenCalledWith(1, '1');
      expect(res.json).toHaveBeenCalledWith({ rating: 80 });
    });

    it('returns 404 if no rating', async () => {
      req.params = { movieId: '1' };
      ratingsModel.getUserRating.mockResolvedValue(null);

      await getUserRating(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'No rating found',
      });
    });
  });

  describe('deleteUserRating', () => {
    it('deletes rating', async () => {
      req.params = { movieId: '1' };
      ratingsModel.deleteRating.mockResolvedValue(true);

      await deleteUserRating(req, res);

      expect(ratingsModel.deleteRating).toHaveBeenCalledWith(1, '1');
      expect(res.json).toHaveBeenCalledWith({
        message: 'Rating deleted',
      });
    });
  });

  describe('getMovieRatings', () => {
    it('returns paginated ratings', async () => {
      req.params = { movieId: '1' };
      req.query = { page: '2', limit: '5' };

      ratingsModel.getRatingsForMovie.mockResolvedValue([]);
      ratingsModel.getRatingCount.mockResolvedValue(10);

      await getMovieRatings(req, res);

      expect(ratingsModel.getRatingsForMovie).toHaveBeenCalledWith(
        '1',
        5,
        5
      );
      expect(ratingsModel.getRatingCount).toHaveBeenCalledWith('1');

      expect(res.json).toHaveBeenCalledWith({
        movieId: '1',
        page: 2,
        limit: 5,
        totalCount: 10,
        totalPages: 2,
        ratings: [],
      });
    });

    it('uses default pagination values', async () => {
      req.params = { movieId: '1' };

      ratingsModel.getRatingsForMovie.mockResolvedValue([]);
      ratingsModel.getRatingCount.mockResolvedValue(0);

      await getMovieRatings(req, res);

      expect(ratingsModel.getRatingsForMovie).toHaveBeenCalledWith(
        '1',
        5,
        0
      );
    });
  });

  describe('getRatingAverages', () => {
    it('returns average rating', async () => {
      req.params = { movieId: '1' };
      ratingsModel.getRatingAvg.mockResolvedValue(75);

      await getRatingAverages(req, res);

      expect(ratingsModel.getRatingAvg).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({
        movieId: 1,
        average: 75,
      });
    });

    it('returns 0 if no ratings', async () => {
      req.params = { movieId: '1' };
      ratingsModel.getRatingAvg.mockResolvedValue(null);

      await getRatingAverages(req, res);

      expect(res.json).toHaveBeenCalledWith({
        movieId: 1,
        average: 0,
      });
    });

    it('returns 400 for invalid movieId', async () => {
      req.params = { movieId: 'abc' };

      await getRatingAverages(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid movieId',
      });
    });
  });
});