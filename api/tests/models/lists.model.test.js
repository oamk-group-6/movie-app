import * as listsModel from '../../src/models/listsModel.js';
import pool from '../../src/database.js';
import crypto from 'crypto';

jest.mock('../../src/database.js', () => ({
  __esModule: true,
  default: { query: jest.fn() }
}));

jest.mock('crypto', () => ({
  randomBytes: jest.fn(() => ({ toString: () => 'mockedshareid' }))
}));

describe('listsModel', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getAllLists', () => {
    it('should return all lists', async () => {
      const mockRows = [{ id: 1, name: 'My List' }];
      pool.query.mockResolvedValue({ rows: mockRows });
      const result = await listsModel.getAllLists();
      expect(result).toEqual(mockRows);
    });

    it('should return empty array if no lists', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await listsModel.getAllLists();
      expect(result).toEqual([]);
    });

    it('should throw if query fails', async () => {
      pool.query.mockRejectedValue(new Error('DB error'));
      await expect(listsModel.getAllLists()).rejects.toThrow('DB error');
    });
  });

  describe('getListById', () => {
    it('should return a list by id', async () => {
      const mockRow = { id: 1, name: 'My List' };
      pool.query.mockResolvedValue({ rows: [mockRow] });
      const result = await listsModel.getListById(1);
      expect(result).toEqual(mockRow);
    });

    it('should return undefined if list not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await listsModel.getListById(999);
      expect(result).toBeUndefined();
    });
  });

  describe('addList', () => {
    it('should add a new list', async () => {
      const newList = { name: 'List', description: 'Desc', owner_user_id: 1, is_public: true };
      const mockRow = { ...newList, share_id: 'mockedshareid' };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await listsModel.addList(newList);
      expect(result).toEqual(mockRow);
    });

    it('should throw if query fails', async () => {
      pool.query.mockRejectedValue(new Error('DB error'));
      await expect(listsModel.addList({ name: 'Test' })).rejects.toThrow('DB error');
    });
  });

  describe('updateList', () => {
    it('should update list', async () => {
      const updatedList = { name: 'Updated', description: 'Desc', is_public: false };
      const mockRow = { id: 1, ...updatedList };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await listsModel.updateList(1, updatedList);
      expect(result).toEqual(mockRow);
    });

    it('should return undefined if list not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await listsModel.updateList(999, { name: 'Test', description: '', is_public: true });
      expect(result).toBeUndefined();
    });
  });

  describe('patchList', () => {
    it('should patch fields', async () => {
      const mockRow = { id: 1, name: 'Patched' };
      pool.query.mockResolvedValue({ rows: [mockRow] });
      const result = await listsModel.patchList(1, { name: 'Patched' });
      expect(result).toEqual(mockRow);
    });

    it('should return null if no fields', async () => {
      const result = await listsModel.patchList(1, {});
      expect(result).toBeNull();
    });

    it('should return undefined if list not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await listsModel.patchList(999, { name: 'Test' });
      expect(result).toBeUndefined();
    });
  });

  describe('deleteList', () => {
    it('should delete list', async () => {
      const mockRow = { id: 1, name: 'Deleted' };
      pool.query.mockResolvedValue({ rows: [mockRow] });
      const result = await listsModel.deleteList(1);
      expect(result).toEqual(mockRow);
    });

    it('should return undefined if list not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await listsModel.deleteList(999);
      expect(result).toBeUndefined();
    });
  });

  describe('getListByShareId', () => {
    it('should return list by shareId', async () => {
      const mockRow = { id: 1, share_id: 'abc123' };
      pool.query.mockResolvedValue({ rows: [mockRow] });
      const result = await listsModel.getListByShareId('abc123');
      expect(result).toEqual(mockRow);
    });

    it('should return undefined if list not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await listsModel.getListByShareId('xyz');
      expect(result).toBeUndefined();
    });

    it('should throw if query fails', async () => {
      pool.query.mockRejectedValue(new Error('DB error'));
      await expect(listsModel.getListByShareId('abc123')).rejects.toThrow('DB error');
    });
  });
});