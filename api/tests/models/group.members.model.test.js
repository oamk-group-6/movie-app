import * as groupMembersModel from '../../src/models/groupMembersModel.js';
import pool from '../../src/database.js';

jest.mock('../../src/database.js', () => ({
  __esModule: true,
  default: { query: jest.fn() }
}));

describe('groupMembersModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addMember', () => {
    it('should add a member with default role', async () => {
      const mockRow = { group_id: 1, user_id: 2, role: 'member' };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await groupMembersModel.addMember(1, 2);
      expect(result).toEqual(mockRow);
    });

    it('should add a member with specific role', async () => {
      const mockRow = { group_id: 1, user_id: 2, role: 'admin' };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await groupMembersModel.addMember(1, 2, 'admin');
      expect(result).toEqual(mockRow);
    });

    it('should throw if query fails', async () => {
      pool.query.mockRejectedValue(new Error('DB error'));
      await expect(groupMembersModel.addMember(1, 2)).rejects.toThrow('DB error');
    });
  });

  describe('removeMember', () => {
    it('should remove a member', async () => {
      const mockRow = { group_id: 1, user_id: 2 };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await groupMembersModel.removeMember(1, 2);
      expect(result).toEqual(mockRow);
    });

    it('should return undefined if member not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await groupMembersModel.removeMember(1, 2);
      expect(result).toBeUndefined();
    });

    it('should throw if query fails', async () => {
      pool.query.mockRejectedValue(new Error('DB error'));
      await expect(groupMembersModel.removeMember(1, 2)).rejects.toThrow('DB error');
    });
  });

  describe('getGroupMembers', () => {
    it('should return group members with username and avatar', async () => {
      const mockRows = [{ user_id: 2, username: 'Alice', avatar_url: 'url' }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await groupMembersModel.getGroupMembers(1);
      expect(result).toEqual(mockRows);
    });

    it('should return empty array if no members', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await groupMembersModel.getGroupMembers(1);
      expect(result).toEqual([]);
    });

    it('should throw if query fails', async () => {
      pool.query.mockRejectedValue(new Error('DB error'));
      await expect(groupMembersModel.getGroupMembers(1)).rejects.toThrow('DB error');
    });
  });
});
