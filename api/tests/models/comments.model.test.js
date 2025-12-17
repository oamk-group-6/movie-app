import * as commentsModel from '../../src/models/commentsModel.js';
import pool from '../../src/database.js';

jest.mock('../../src/database.js', () => ({
  __esModule: true,
  default: { query: jest.fn() }
}));

describe('commentsModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllComments', () => {
    it('should return all comments', async () => {
      pool.query.mockResolvedValue({ rows: [{ id: 1, content: 'Test' }] });

      const result = await commentsModel.getAllComments();

      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM comments ORDER BY created_at DESC");
      expect(result).toEqual([{ id: 1, content: 'Test' }]);
    });

    it('should return empty array if no comments', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await commentsModel.getAllComments();

      expect(result).toEqual([]);
    });
  });

  describe('getCommentById', () => {
    it('should return a comment by id', async () => {
      pool.query.mockResolvedValue({ rows: [{ id: 1, content: 'Test' }] });

      const result = await commentsModel.getCommentById(1);

      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM comments WHERE id = $1", [1]);
      expect(result).toEqual({ id: 1, content: 'Test' });
    });

    it('should return undefined if comment not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await commentsModel.getCommentById(999);

      expect(result).toBeUndefined();
    });
  });

  describe('addComment', () => {
    it('should insert and return new comment', async () => {
      const newComment = { user_id: 1, movie_id: 2, list_id: null, content: 'Nice movie' };
      pool.query.mockResolvedValue({ rows: [{ id: 1, ...newComment }] });

      const result = await commentsModel.addComment(newComment);

      expect(pool.query).toHaveBeenCalledWith(
        `INSERT INTO comments (user_id, movie_id, list_id, content) VALUES ($1,$2,$3,$4) RETURNING *`,
        [1, 2, null, 'Nice movie']
      );
      expect(result).toEqual({ id: 1, ...newComment });
    });

    it('should handle missing optional fields', async () => {
      const newComment = { user_id: 1, movie_id: 2, content: 'Test without list_id' };
      pool.query.mockResolvedValue({ rows: [{ id: 2, ...newComment, list_id: null }] });

      const result = await commentsModel.addComment(newComment);

      expect(result).toEqual({ id: 2, ...newComment, list_id: null });
    });
  });

  describe('updateComment', () => {
    it('should update comment content', async () => {
      pool.query.mockResolvedValue({ rows: [{ id: 1, content: 'Updated' }] });

      const result = await commentsModel.updateComment(1, { content: 'Updated' });

      expect(pool.query).toHaveBeenCalledWith(
        `UPDATE comments SET content=$1 WHERE id=$2 RETURNING *`,
        ['Updated', 1]
      );
      expect(result).toEqual({ id: 1, content: 'Updated' });
    });

    it('should return undefined if comment not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await commentsModel.updateComment(999, { content: 'Updated' });

      expect(result).toBeUndefined();
    });
  });

  describe('patchComment', () => {
    it('should patch single field', async () => {
      pool.query.mockResolvedValue({ rows: [{ id: 1, content: 'Patched' }] });

      const result = await commentsModel.patchComment(1, { content: 'Patched' });

      expect(pool.query).toHaveBeenCalled();
      expect(result).toEqual({ id: 1, content: 'Patched' });
    });

    it('should patch multiple fields', async () => {
      const fields = { content: 'Patched', movie_id: 2 };
      pool.query.mockResolvedValue({ rows: [{ id: 1, ...fields }] });

      const result = await commentsModel.patchComment(1, fields);

      expect(pool.query).toHaveBeenCalled();
      expect(result).toEqual({ id: 1, ...fields });
    });

    it('should return null if no fields', async () => {
      const result = await commentsModel.patchComment(1, {});
      expect(result).toBeNull();
    });

    it('should return undefined if comment not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await commentsModel.patchComment(999, { content: 'Test' });
      expect(result).toBeUndefined();
    });
  });

  describe('deleteComment', () => {
    it('should delete comment', async () => {
      pool.query.mockResolvedValue({ rows: [{ id: 1, content: 'Deleted' }] });

      const result = await commentsModel.deleteComment(1);

      expect(pool.query).toHaveBeenCalledWith("DELETE FROM comments WHERE id = $1 RETURNING *", [1]);
      expect(result).toEqual({ id: 1, content: 'Deleted' });
    });

    it('should return undefined if comment not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await commentsModel.deleteComment(999);
      expect(result).toBeUndefined();
    });
  });
});

