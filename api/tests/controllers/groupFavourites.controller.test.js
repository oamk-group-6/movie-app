import {
  getGroupFavourites,
  createGroupFavourite,
  deleteGroupFavourite,
  getGroupFavouriteStatus,
} from '../../src/controllers/groupFavouritesController.js';

import * as favouritesModel from '../../src/models/groupFavouritesModel.js';
import * as groupsModel from '../../src/models/groupsModel.js';
import { mockReq, mockRes } from '../helpers/testUtils.js';

jest.mock('../../src/models/groupFavouritesModel.js');
jest.mock('../../src/models/groupsModel.js');

describe('groupFavouritesController', () => {
  let req, res;

  beforeEach(() => {
    req = mockReq({ user: { userId: 1 } });
    res = mockRes();
    jest.clearAllMocks();
  });

  describe('getGroupFavourites', () => {
    it('should return group favourites', async () => {
      req.params.groupId = '1';
      favouritesModel.getAllGroupFavourites.mockResolvedValue([]);

      await getGroupFavourites(req, res);

      expect(favouritesModel.getAllGroupFavourites)
        .toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should return 500 on error', async () => {
      favouritesModel.getAllGroupFavourites.mockRejectedValue(new Error());

      await getGroupFavourites(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('createGroupFavourite', () => {
    it('should create favourite if user is member', async () => {
      req.params.groupId = '1';
      req.body.movieId = 10;

      groupsModel.getGroupById.mockResolvedValue({ id: 1 });
      groupsModel.isUserMember.mockResolvedValue(true);
      favouritesModel.addFavouriteToGroup.mockResolvedValue({});

      await createGroupFavourite(req, res);

      expect(favouritesModel.addFavouriteToGroup)
        .toHaveBeenCalledWith('1', 10, 1);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 404 if group not found', async () => {
      req.params.groupId = '1';

      groupsModel.getGroupById.mockResolvedValue(null);

      await createGroupFavourite(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 403 if user not member', async () => {
      req.params.groupId = '1';
      req.body.movieId = 10;

      groupsModel.getGroupById.mockResolvedValue({ id: 1 });
      groupsModel.isUserMember.mockResolvedValue(false);

      await createGroupFavourite(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('deleteGroupFavourite', () => {
    it('should delete favourite if member', async () => {
      req.params = { groupId: '1', movieId: '10' };

      groupsModel.getGroupById.mockResolvedValue({ id: 1 });
      groupsModel.isUserMember.mockResolvedValue(true);
      favouritesModel.removeFavouriteFromGroup.mockResolvedValue(true);

      await deleteGroupFavourite(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Removed from group favourites',
      });
    });

    it('should return 404 if favourite not found', async () => {
      req.params = { groupId: '1', movieId: '10' };

      groupsModel.getGroupById.mockResolvedValue({ id: 1 });
      groupsModel.isUserMember.mockResolvedValue(true);
      favouritesModel.removeFavouriteFromGroup.mockResolvedValue(null);

      await deleteGroupFavourite(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 403 if user not member', async () => {
      req.params = { groupId: '1', movieId: '10' };

      groupsModel.getGroupById.mockResolvedValue({ id: 1 });
      groupsModel.isUserMember.mockResolvedValue(false);

      await deleteGroupFavourite(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('getGroupFavouriteStatus', () => {
    it('should return favourite status', async () => {
      req.params = { groupId: '1', movieId: '10' };
      favouritesModel.checkGroupFavourite.mockResolvedValue(true);

      await getGroupFavouriteStatus(req, res);

      expect(res.json).toHaveBeenCalledWith({ isFavourite: true });
    });
  });
});