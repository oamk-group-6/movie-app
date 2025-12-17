import * as groupCommentsModel from '../../src/models/groupCommentsModel.js';
import pool from '../../src/database.js';

jest.mock('../../src/database.js', () => ({
  __esModule: true,
  default: { query: jest.fn() }
}));

describe('groupCommentsModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllGroupComments', () => {
    it('should return all group comments', async () => {
      pool.query.mockResolvedValue({ rows: [{ id: 1, content: 'Test comment' }] });

      const result = await groupCommentsModel.getAllGroupComments();

      expect(result).toEqual([{ id: 1, content: 'Test comment' }]);
    });

    it('should return empty array if no comments', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await groupCommentsModel.getAllGroupComments();
      expect(result).toEqual([]);
    });
  });

  describe('getGroupCommentById', () => {
    it('should return comment by id', async () => {
      pool.query.mockResolvedValue({ rows: [{ id: 1, content: 'Test' }] });
      const result = await groupCommentsModel.getGroupCommentById(1);
      expect(result).toEqual({ id: 1, content: 'Test' });
    });

    it('should return undefined if not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await groupCommentsModel.getGroupCommentById(999);
      expect(result).toBeUndefined();
    });
  });

  describe('addGroupComment', () => {
    it('should insert comment and include username', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ id: 1, user_id: 1, group_id: 2, content: 'Hello' }] })
        .mockResolvedValueOnce({ rows: [{ username: 'Alice' }] });

      const result = await groupCommentsModel.addGroupComment({ user_id: 1, group_id: 2, content: 'Hello' });
      expect(result).toEqual({ id: 1, user_id: 1, group_id: 2, content: 'Hello', username: 'Alice' });
    });
  });

  describe('updateGroupComment', () => {
    it('should update comment', async () => {
      pool.query.mockResolvedValue({ rows: [{ id: 1, content: 'Updated' }] });
      const result = await groupCommentsModel.updateGroupComment(1, { content: 'Updated' });
      expect(result).toEqual({ id: 1, content: 'Updated' });
    });

    it('should return undefined if comment not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await groupCommentsModel.updateGroupComment(999, { content: 'Updated' });
      expect(result).toBeUndefined();
    });
  });

  describe('patchGroupComment', () => {
    it('should patch single field', async () => {
      pool.query.mockResolvedValue({ rows: [{ id: 1, content: 'Patched' }] });
      const result = await groupCommentsModel.patchGroupComment(1, { content: 'Patched' });
      expect(result).toEqual({ id: 1, content: 'Patched' });
    });

    it('should patch multiple fields', async () => {
      const fields = { content: 'Patched', group_id: 2 };
      pool.query.mockResolvedValue({ rows: [{ id: 1, ...fields }] });
      const result = await groupCommentsModel.patchGroupComment(1, fields);
      expect(result).toEqual({ id: 1, ...fields });
    });

    it('should return null if no fields', async () => {
      const result = await groupCommentsModel.patchGroupComment(1, {});
      expect(result).toBeNull();
    });

    it('should return undefined if comment not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await groupCommentsModel.patchGroupComment(999, { content: 'Test' });
      expect(result).toBeUndefined();
    });
  });

  describe('deleteGroupComment', () => {
    it('should delete comment', async () => {
      pool.query.mockResolvedValue({ rows: [{ id: 1, content: 'Deleted' }] });
      const result = await groupCommentsModel.deleteGroupComment(1);
      expect(result).toEqual({ id: 1, content: 'Deleted' });
    });

    it('should return undefined if comment not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await groupCommentsModel.deleteGroupComment(999);
      expect(result).toBeUndefined();
    });
  });

  describe('getCommentsByGroupId', () => {
    it('should return comments with usernames', async () => {
      const mockRows = [{ id: 1, content: 'Hi', username: 'Alice' }];
      pool.query.mockResolvedValue({ rows: mockRows });
      const result = await groupCommentsModel.getCommentsByGroupId(2);
      expect(result).toEqual(mockRows);
    });

    it('should return empty array if no comments', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await groupCommentsModel.getCommentsByGroupId(2);
      expect(result).toEqual([]);
    });
  });

  describe('countGroupComments', () => {
    it('should return count', async () => {
      pool.query.mockResolvedValue({ rows: [{ total: '5' }] });
      const result = await groupCommentsModel.countGroupComments(2);
      expect(result).toEqual({ total: '5' });
    });

    it('should return 0 if no comments', async () => {
      pool.query.mockResolvedValue({ rows: [{ total: '0' }] });
      const result = await groupCommentsModel.countGroupComments(2);
      expect(result).toEqual({ total: '0' });
    });
  });

  describe('getUserCommentsInGroup', () => {
    it('should return user comments', async () => {
      const mockRows = [{ id: 1, content: 'User comment' }];
      pool.query.mockResolvedValue({ rows: mockRows });
      const result = await groupCommentsModel.getUserCommentsInGroup(1, 2);
      expect(result).toEqual(mockRows);
    });

    it('should return empty array if no comments', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await groupCommentsModel.getUserCommentsInGroup(1, 2);
      expect(result).toEqual([]);
    });
  });
});