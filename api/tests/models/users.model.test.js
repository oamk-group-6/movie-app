import * as usersModel from '../../src/models/usersModel.js';
import pool from '../../src/database.js';
import bcrypt from 'bcrypt';

jest.mock('../../src/database.js', () => ({
  __esModule: true,
  default: { query: jest.fn() }
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

describe('usersModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockRows = [{ id: 1, username: 'Alice' }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await usersModel.getAllUsers();

      expect(pool.query).toHaveBeenCalledWith("SELECT id, username, email, avatar_url, bio, created_at FROM users");
      expect(result).toEqual(mockRows);
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const mockRow = { id: 1, username: 'Alice' };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await usersModel.getUserById(1);

      expect(result).toEqual(mockRow);
    });

    it('should return null if not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await usersModel.getUserById(999);
      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      const mockRow = { id: 1, email: 'a@test.com' };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await usersModel.getUserByEmail('a@test.com');
      expect(result).toEqual(mockRow);
    });
  });

  describe('getUserByUsername', () => {
    it('should return user by username', async () => {
      const mockRow = { id: 1, username: 'Alice' };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await usersModel.getUserByUsername('Alice');
      expect(result).toEqual(mockRow);
    });
  });

  describe('searchUsersByUsername', () => {
    it('should search users by prefix', async () => {
      const mockRows = [{ id: 1, username: 'Alice' }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await usersModel.searchUsersByUsername('Al');

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT id::int, username FROM users WHERE username ILIKE $1 LIMIT 10`,
        ['Al%']
      );
      expect(result).toEqual(mockRows);
    });
  });

  describe('addUser', () => {
    it('should hash password and insert user', async () => {
      bcrypt.hash.mockResolvedValue('hashedpwd');
      const user = { username: 'Alice', email: 'a@test.com', password: '123', avatar_url: null, bio: '' };
      const mockRow = { id: 1, username: 'Alice', email: 'a@test.com' };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await usersModel.addUser(user);

      expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
      expect(pool.query).toHaveBeenCalled();
      expect(result).toEqual(mockRow);
    });

    it('should throw error if no rows returned', async () => {
      bcrypt.hash.mockResolvedValue('hashedpwd');
      pool.query.mockResolvedValue({ rows: [] });

      await expect(usersModel.addUser({ username: 'Bob', email: 'b@test.com', password: '123' })).rejects.toThrow("User insertion returned no rows");
    });
  });

  describe('updateUser', () => {
    it('should update user data', async () => {
      const mockRow = { id: 1, username: 'Alice' };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await usersModel.updateUser(1, { username: 'Alice', email: 'a@test.com', avatar_url: null, bio: '' });

      expect(result).toEqual(mockRow);
    });
  });

  describe('updatePassword', () => {
    it('should update password if oldPassword matches', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ password_hash: 'oldhash' }] }) // get user
        .mockResolvedValueOnce({ rows: [{ id: 1, username: 'Alice' }] }); // update

      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('newhash');

      const result = await usersModel.updatePassword(1, 'old', 'new');

      expect(bcrypt.compare).toHaveBeenCalledWith('old', 'oldhash');
      expect(bcrypt.hash).toHaveBeenCalledWith('new', 10);
      expect(result).toEqual({ id: 1, username: 'Alice' });
    });

    it('should return null if user not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await usersModel.updatePassword(999, 'old', 'new');
      expect(result).toBeNull();
    });

    it('should throw error if old password incorrect', async () => {
      pool.query.mockResolvedValue({ rows: [{ password_hash: 'hash' }] });
      bcrypt.compare.mockResolvedValue(false);

      await expect(usersModel.updatePassword(1, 'wrong', 'new')).rejects.toThrow("Incorrect current password");
    });
  });

  describe('patchUser', () => {
    it('should patch allowed fields', async () => {
      const mockRow = { id: 1, username: 'Alice' };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await usersModel.patchUser(1, { username: 'AliceNew' });
      expect(result).toEqual(mockRow);
    });

    it('should throw error if patching password', async () => {
      await expect(usersModel.patchUser(1, { password: '123' })).rejects.toThrow("Password cannot be changed via PATCH.");
    });

    it('should return null if no fields', async () => {
      const result = await usersModel.patchUser(1, {});
      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const mockRow = { id: 1, username: 'Alice' };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await usersModel.deleteUser(1);
      expect(result).toEqual(mockRow);
    });
  });

  describe('updateAvatar', () => {
    it('should update avatar', async () => {
      const mockRow = { id: 1, avatar_url: '/url' };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await usersModel.updateAvatar(1, '/url');
      expect(result).toEqual(mockRow);
    });
  });
});

