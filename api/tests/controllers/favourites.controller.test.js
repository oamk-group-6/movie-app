import {
  addFavouriteController,
  removeFavouriteController,
  getFavouritesController,
} from '../../src/controllers/favouritesController.js';

import * as favouritesModel from '../../src/models/favouritesModel.js';
import { mockReq, mockRes } from '../helpers/testUtils.js';

jest.mock('../../src/models/favouritesModel.js');

describe('favouritesController', () => {
  let req, res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    jest.clearAllMocks();
  });

  describe('addFavouriteController', () => {
    it('should add favourite and return it', async () => {
      const mockFavourite = { userId: 1, movieId: 10 };
      req.body = { userId: 1, movieId: 10 };

      favouritesModel.addFavourite.mockResolvedValue(mockFavourite);

      await addFavouriteController(req, res);

      expect(favouritesModel.addFavourite).toHaveBeenCalledWith(1, 10);
      expect(res.json).toHaveBeenCalledWith(mockFavourite);
    });

    it('should throw error if model fails', async () => {
      req.body = { userId: 1, movieId: 10 };
      favouritesModel.addFavourite.mockRejectedValue(new Error('DB error'));

      await expect(addFavouriteController(req, res))
        .rejects.toThrow('DB error');
    });
  });

  describe('removeFavouriteController', () => {
    it('should remove favourite and return success', async () => {
      req.params = { userId: '1', movieId: '10' };

      favouritesModel.removeFavourite.mockResolvedValue();

      await removeFavouriteController(req, res);

      expect(favouritesModel.removeFavourite)
        .toHaveBeenCalledWith('1', '10');
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('should throw error if model fails', async () => {
      req.params = { userId: '1', movieId: '10' };
      favouritesModel.removeFavourite.mockRejectedValue(new Error('DB error'));

      await expect(removeFavouriteController(req, res))
        .rejects.toThrow('DB error');
    });
  });

  describe('getFavouritesController', () => {
    it('should return favourites for user', async () => {
      const mockFavourites = [{ movieId: 10 }, { movieId: 20 }];
      req.params = { userId: '1' };

      favouritesModel.getFavouritesByUser.mockResolvedValue(mockFavourites);

      await getFavouritesController(req, res);

      expect(favouritesModel.getFavouritesByUser)
        .toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockFavourites);
    });

    it('should throw error if model fails', async () => {
      req.params = { userId: '1' };
      favouritesModel.getFavouritesByUser.mockRejectedValue(new Error('DB error'));

      await expect(getFavouritesController(req, res))
        .rejects.toThrow('DB error');
    });
  });
});