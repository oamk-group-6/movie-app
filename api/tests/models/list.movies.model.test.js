import * as listsMoviesModel from '../../src/models/listMoviesModel.js';
import pool from '../../src/database.js';

jest.mock('../../src/database.js', () => ({
  __esModule: true,
  default: { query: jest.fn() }
}));

describe('listsMoviesModel', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getMoviesInList', () => {
    it('should return movies in a list', async () => {
      const mockRows = [{ movie_id: 1, title: 'Movie1', poster_url: 'url', release_year: 2022 }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await listsMoviesModel.getMoviesInList(1);
      expect(result).toEqual(mockRows);
    });

    it('should return empty array if no movies', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await listsMoviesModel.getMoviesInList(1);
      expect(result).toEqual([]);
    });

    it('should throw if query fails', async () => {
      pool.query.mockRejectedValue(new Error('DB error'));
      await expect(listsMoviesModel.getMoviesInList(1)).rejects.toThrow('DB error');
    });
  });

  describe('addMovieToList', () => {
    it('should add a movie to a list', async () => {
      const mockRow = { list_id: 1, movie_id: 2, added_by_user_id: 3 };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await listsMoviesModel.addMovieToList(1, 2, 3);
      expect(result).toEqual(mockRow);
    });

    it('should return undefined if movie already in list', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await listsMoviesModel.addMovieToList(1, 2, 3);
      expect(result).toBeUndefined();
    });

    it('should throw if query fails', async () => {
      pool.query.mockRejectedValue(new Error('DB error'));
      await expect(listsMoviesModel.addMovieToList(1, 2, 3)).rejects.toThrow('DB error');
    });
  });

  describe('removeMovieFromList', () => {
    it('should remove a movie from a list', async () => {
      const mockRow = { list_id: 1, movie_id: 2 };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await listsMoviesModel.removeMovieFromList(1, 2);
      expect(result).toEqual(mockRow);
    });

    it('should return undefined if movie not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await listsMoviesModel.removeMovieFromList(1, 2);
      expect(result).toBeUndefined();
    });

    it('should throw if query fails', async () => {
      pool.query.mockRejectedValue(new Error('DB error'));
      await expect(listsMoviesModel.removeMovieFromList(1, 2)).rejects.toThrow('DB error');
    });
  });
});