import * as groupFavouritesModel from '../../src/models/groupFavouritesModel.js';
import pool from '../../src/database.js';

jest.mock('../../src/database.js', () => ({
  __esModule: true,
  default: { query: jest.fn() }
}));

describe('groupFavouritesModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllGroupFavourites', () => {
    it('should return group favourites', async () => {
      const mockRows = [{ id: 1, title: 'Movie1', poster_url: 'url' }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await groupFavouritesModel.getAllGroupFavourites(1);
      expect(result).toEqual(mockRows);
    });

    it('should return empty array if no favourites', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await groupFavouritesModel.getAllGroupFavourites(1);
      expect(result).toEqual([]);
    });

    it('should throw if query fails', async () => {
      pool.query.mockRejectedValue(new Error('DB error'));
      await expect(groupFavouritesModel.getAllGroupFavourites(1)).rejects.toThrow('DB error');
    });
  });

  describe('addFavouriteToGroup', () => {
    it('should add favourite to group', async () => {
      const mockRow = { group_id: 1, movie_id: 2, added_by: 3 };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await groupFavouritesModel.addFavouriteToGroup(1, 2, 3);
      expect(result).toEqual(mockRow);
    });

    it('should throw if query fails', async () => {
      pool.query.mockRejectedValue(new Error('DB error'));
      await expect(groupFavouritesModel.addFavouriteToGroup(1, 2, 3)).rejects.toThrow('DB error');
    });
  });

  describe('removeFavouriteFromGroup', () => {
    it('should remove favourite from group', async () => {
      const mockRow = { group_id: 1, movie_id: 2 };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await groupFavouritesModel.removeFavouriteFromGroup(1, 2);
      expect(result).toEqual(mockRow);
    });

    it('should return undefined if favourite not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await groupFavouritesModel.removeFavouriteFromGroup(1, 2);
      expect(result).toBeUndefined();
    });

    it('should throw if query fails', async () => {
      pool.query.mockRejectedValue(new Error('DB error'));
      await expect(groupFavouritesModel.removeFavouriteFromGroup(1, 2)).rejects.toThrow('DB error');
    });
  });

  describe('checkGroupFavourite', () => {
    it('should return true if favourite exists', async () => {
      pool.query.mockResolvedValue({ rows: [{ group_id: 1, movie_id: 2 }] });
      const result = await groupFavouritesModel.checkGroupFavourite(1, 2);
      expect(result).toBe(true);
    });

    it('should return false if favourite does not exist', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await groupFavouritesModel.checkGroupFavourite(1, 2);
      expect(result).toBe(false);
    });

    it('should throw if query fails', async () => {
      pool.query.mockRejectedValue(new Error('DB error'));
      await expect(groupFavouritesModel.checkGroupFavourite(1, 2)).rejects.toThrow('DB error');
    });
  });
});
