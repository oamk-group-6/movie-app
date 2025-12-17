import * as ratingsModel from '../../src/models/ratingsModel.js';
import pool from '../../src/database.js';

jest.mock('../../src/database.js', () => ({
  __esModule: true,
  default: { query: jest.fn() }
}));

describe('ratingsModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('upsertRating', () => {
    it('should insert or update rating and update movie stats', async () => {
      const mockRow = { user_id: 1, movie_id: 2, rating: 8 };
      pool.query.mockResolvedValueOnce({ rows: [mockRow] }); // insert/update rating
      pool.query.mockResolvedValueOnce({}); // update movie stats

      const result = await ratingsModel.upsertRating(1, 2, 8, 'Nice');

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockRow);
    });
  });

  describe('getUserRating', () => {
    it('should return user rating', async () => {
      const mockRow = { rating: 8, review: 'Nice' };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await ratingsModel.getUserRating(1, 2);

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT rating, review FROM ratings WHERE user_id = $1 AND movie_id = $2`,
        [1, 2]
      );
      expect(result).toEqual(mockRow);
    });

    it('should return null if not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await ratingsModel.getUserRating(1, 2);
      expect(result).toBeNull();
    });
  });

  describe('deleteRating', () => {
    it('should delete rating and update movie stats', async () => {
      pool.query.mockResolvedValue({});

      await ratingsModel.deleteRating(1, 2);

      expect(pool.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('getRatingsForMovie', () => {
    it('should return paginated ratings', async () => {
      const mockRows = [{ user_id: 1, username: 'User', rating: 8 }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await ratingsModel.getRatingsForMovie(2, 5, 0);

      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [2, 5, 0]);
      expect(result).toEqual(mockRows);
    });
  });

  describe('getRatingCount', () => {
    it('should return rating count', async () => {
      pool.query.mockResolvedValue({ rows: [{ count: '3' }] });

      const result = await ratingsModel.getRatingCount(2);

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT COUNT(*) FROM ratings WHERE movie_id = $1`,
        [2]
      );
      expect(result).toEqual(3);
    });
  });

  describe('getRatingAvg', () => {
    it('should return average rating', async () => {
      pool.query.mockResolvedValue({ rows: [{ rating_avg: 7.5 }] });

      const result = await ratingsModel.getRatingAvg(2);

      expect(pool.query).toHaveBeenCalledWith(
        `
        SELECT AVG(rating) AS rating_avg
        FROM ratings
        WHERE movie_id = $1
        `,
        [2]
      );
      expect(result).toEqual(7.5);
    });
  });
});
