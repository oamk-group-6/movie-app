import * as moviesModel from '../../src/models/moviesModel.js';
import pool from '../../src/database.js';

jest.mock('../../src/database.js', () => ({
  __esModule: true,
  default: { query: jest.fn() }
}));

describe('moviesModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllMovies', () => {
    it('should fetch all movies without filters', async () => {
      const mockRows = [{ id: 1, title: 'Movie1' }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await moviesModel.getAllMovies();

      expect(pool.query).toHaveBeenCalled();
      expect(result).toEqual(mockRows);
    });

    it('should fetch movies with userId', async () => {
      const mockRows = [{ id: 1, title: 'Movie1', user_rating: 5 }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await moviesModel.getAllMovies({}, 1);

      expect(pool.query).toHaveBeenCalled();
      expect(result).toEqual(mockRows);
    });
  });

  describe('getMovieById', () => {
    it('should return a movie by id', async () => {
      const mockRow = { id: 1, title: 'Movie1' };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await moviesModel.getMovieById(1);

      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM movies WHERE id = $1", [1]);
      expect(result).toEqual(mockRow);
    });

    it('should return null if not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await moviesModel.getMovieById(999);
      expect(result).toBeNull();
    });
  });

  describe('addMovie', () => {
    it('should insert a new movie', async () => {
      const movie = { external_id: 1, title: 'Movie', original_title: 'Orig', release_year: 2020, genre: 'Action', description: 'Desc', poster_url: 'url', runtime: 120, language: 'EN' };
      const mockRow = { id: 1, ...movie };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await moviesModel.addMovie(movie);

      expect(pool.query).toHaveBeenCalled();
      expect(result).toEqual(mockRow);
    });
  });

  describe('updateMovie', () => {
    it('should update a movie', async () => {
      const movie = { title: 'Updated', original_title: 'Orig', release_year: 2020, genre: 'Action', description: 'Desc', poster_url: 'url', runtime: 120, language: 'EN' };
      const mockRow = { id: 1, ...movie };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await moviesModel.updateMovie(1, movie);

      expect(pool.query).toHaveBeenCalled();
      expect(result).toEqual(mockRow);
    });
  });

  describe('patchMovie', () => {
    it('should patch fields', async () => {
      const mockRow = { id: 1, title: 'Patched' };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await moviesModel.patchMovie(1, { title: 'Patched' });

      expect(pool.query).toHaveBeenCalled();
      expect(result).toEqual(mockRow);
    });

    it('should return null if no fields', async () => {
      const result = await moviesModel.patchMovie(1, {});
      expect(result).toBeNull();
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie', async () => {
      const mockRow = { id: 1, title: 'Deleted' };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await moviesModel.deleteMovie(1);

      expect(pool.query).toHaveBeenCalledWith("DELETE FROM movies WHERE id=$1 RETURNING *", [1]);
      expect(result).toEqual(mockRow);
    });
  });

  describe('getTopRatedMovies', () => {
    it('should return top rated movies', async () => {
      const mockRows = [{ id: 1, title: 'Movie1', avg_rating: 9 }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await moviesModel.getTopRatedMovies(5);

      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [5]);
      expect(result).toEqual(mockRows);
    });
  });

  describe('getNowPlayingMovies', () => {
    it('should return now playing movies', async () => {
      const mockRows = [{ id: 1, title: 'Movie1' }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await moviesModel.getNowPlayingMovies(40);

      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [40]);
      expect(result).toEqual(mockRows);
    });
  });
});

