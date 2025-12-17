import {
  getLists,
  getListById,
  createList,
  updateList,
  patchList,
  deleteList,
  getSharedList,
} from '../../src/controllers/listsController.js';

import * as listsModel from '../../src/models/listsModel.js';
import { mockReq, mockRes } from '../helpers/testUtils.js';

jest.mock('../../src/models/listsModel.js');

describe('listsController', () => {
  let req, res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    jest.clearAllMocks();
  });

  describe('getLists', () => {
    it('returns all lists', async () => {
      listsModel.getAllLists.mockResolvedValue([]);

      await getLists(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getListById', () => {
    it('returns list', async () => {
      req.params = { id: '1' };
      listsModel.getListById.mockResolvedValue({ id: 1 });

      await getListById(req, res);

      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('returns 404 if not found', async () => {
      req.params = { id: '1' };
      listsModel.getListById.mockResolvedValue(null);

      await getListById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createList', () => {
    it('creates list with owner_user_id', async () => {
      req.body = { name: 'List', owner_user_id: 1 };
      listsModel.addList.mockResolvedValue({ id: 1 });

      await createList(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('returns 400 if no owner provided', async () => {
      req.body = { name: 'List' };

      await createList(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(listsModel.addList).not.toHaveBeenCalled();
    });

    it('returns 400 if both owners provided', async () => {
      req.body = { owner_user_id: 1, owner_group_id: 2 };

      await createList(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('updateList', () => {
    it('updates list', async () => {
      req.params = { id: '1' };
      listsModel.updateList.mockResolvedValue({});

      await updateList(req, res);

      expect(res.json).toHaveBeenCalled();
    });

    it('returns 404 if not found', async () => {
      req.params = { id: '1' };
      listsModel.updateList.mockResolvedValue(null);

      await updateList(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('patchList', () => {
    it('patches list', async () => {
      req.params = { id: '1' };
      listsModel.patchList.mockResolvedValue({});

      await patchList(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('deleteList', () => {
    it('deletes list', async () => {
      req.params = { id: '1' };
      listsModel.deleteList.mockResolvedValue({ id: 1 });

      await deleteList(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'List deleted',
        list: { id: 1 },
      });
    });
  });

  describe('getSharedList', () => {
    it('returns public shared list', async () => {
      req.params = { share_id: 'abc' };
      listsModel.getListByShareId.mockResolvedValue({ is_public: true });

      await getSharedList(req, res);

      expect(res.json).toHaveBeenCalled();
    });

    it('returns 403 if list is private', async () => {
      req.params = { share_id: 'abc' };
      listsModel.getListByShareId.mockResolvedValue({ is_public: false });

      await getSharedList(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});