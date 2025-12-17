import { registerUser, loginUser, logoutUser } from '../../src/controllers/authController.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  getUserByEmail,
  getUserByUsername,
  addUser,
} from '../../src/models/usersModel.js';

import { mockReq, mockRes } from '../helpers/testUtils.js';

jest.mock('../../src/models/usersModel.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('authController', () => {
  let req, res, next;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register user successfully', async () => {
      req.body = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123',
      };

      getUserByUsername.mockResolvedValue(null);
      getUserByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedpassword');
      addUser.mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@test.com',
      });

      await registerUser(req, res, next);

      expect(getUserByUsername).toHaveBeenCalledWith('testuser');
      expect(getUserByEmail).toHaveBeenCalledWith('test@test.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(addUser).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@test.com',
        },
      });
    });

    it('should return 400 if fields are missing', async () => {
      req.body = { email: 'test@test.com' };

      await registerUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'All fields are required',
      });
    });

    it('should return 400 if username already exists', async () => {
      req.body = {
        username: 'testuser',
        email: 'test@test.com',
        password: '123',
      };

      getUserByUsername.mockResolvedValue({ id: 1 });

      await registerUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Username is already in use',
      });
    });

    it('should return 400 if email already exists', async () => {
      req.body = {
        username: 'testuser',
        email: 'test@test.com',
        password: '123',
      };

      getUserByUsername.mockResolvedValue(null);
      getUserByEmail.mockResolvedValue({ id: 1 });

      await registerUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email is already registered',
      });
    });

    it('should call next on unexpected error', async () => {
      req.body = {
        username: 'testuser',
        email: 'test@test.com',
        password: '123',
      };

      getUserByUsername.mockRejectedValue(new Error('DB error'));

      await registerUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    it('should return 400 if email or password missing', async () => {
      req.body = { email: 'test@test.com' };

      await loginUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email and password are required',
      });
    });

    it('should return 401 if user not found', async () => {
      req.body = {
        email: 'test@test.com',
        password: '123',
      };

      getUserByEmail.mockResolvedValue(null);

      await loginUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid email or password',
      });
    });

    it('should return 401 if password is invalid', async () => {
      req.body = {
        email: 'test@test.com',
        password: 'wrong',
      };

      getUserByEmail.mockResolvedValue({
        password_hash: 'hashed',
      });

      bcrypt.compare.mockResolvedValue(false);

      await loginUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should login successfully', async () => {
      req.body = {
        email: 'test@test.com',
        password: 'password123',
      };

      getUserByEmail.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        username: 'testuser',
        password_hash: 'hashed',
      });

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('jwt-token');

      await loginUser(req, res, next);

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          email: 'test@test.com',
          username: 'testuser',
        }),
        expect.any(String)
      );

      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        token: 'jwt-token',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@test.com',
        },
      });
    });

    it('should call next if jwt.sign throws', async () => {
      req.body = {
        email: 'test@test.com',
        password: 'password123',
      };

      getUserByEmail.mockResolvedValue({
        password_hash: 'hashed',
      });

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockImplementation(() => {
        throw new Error('JWT error');
      });

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('logoutUser', () => {
    it('should logout successfully', () => {
      logoutUser(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Logout successful',
      });
    });
  });
});
