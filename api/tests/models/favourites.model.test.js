import * as favouritesModel from '../../src/models/favouritesModel.js';
import pool from '../../src/database.js';

jest.mock('../../src/database.js', () => ({
  __esModule: true,
  default: { query: jest.fn() }
}));

describe('favouritesModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addFavourite', () => {
    it('should add favourite and return it', async () => {
      pool.query.mockResolvedValue({ rows: [{ user_id: 1, movie_id: 2 }] });

      const result = await favouritesModel.addFavourite(1, 2);

      expect(result).toEqual({ user_id: 1, movie_id: 2 });
      expect(pool.query).toHaveBeenCalled();
    });

    it('should return null if favourite already exists', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await favouritesModel.addFavourite(1, 2);
      expect(result).toBeNull();
    });

    it('should throw if query fails', async () => {
      pool.query.mockRejectedValue(new Error('DB error'));

      await expect(favouritesModel.addFavourite(1, 2)).rejects.toThrow('DB error');
    });
  });

  describe('removeFavourite', () => {
    it('should remove favourite', async () => {
      pool.query.mockResolvedValue();

      await favouritesModel.removeFavourite(1, 2);

      expect(pool.query).toHaveBeenCalledWith(
        `DELETE FROM favourites WHERE user_id = $1 AND movie_id = $2`,
        [1, 2]
      );
    });

    it('should throw if query fails', async () => {
      pool.query.mockRejectedValue(new Error('DB error'));
      await expect(favouritesModel.removeFavourite(1, 2)).rejects.toThrow('DB error');
    });
  });

  describe('getFavouritesByUser', () => {
    it('should return favourites with ratings', async () => {
      const mockRows = [{ id: 2, title: 'Movie', user_rating: 80 }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await favouritesModel.getFavouritesByUser(1);

      expect(result).toEqual(mockRows);
    });

    it('should return empty array if no favourites', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await favouritesModel.getFavouritesByUser(1);

      expect(result).toEqual([]);
    });

    it('should throw if query fails', async () => {
      pool.query.mockRejectedValue(new Error('DB error'));
      await expect(favouritesModel.getFavouritesByUser(1)).rejects.toThrow('DB error');
    });
  });
});