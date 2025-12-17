import {
  getGroupComments,
  getGroupCommentById,
  createGroupComment,
  updateGroupComment,
  patchGroupComment,
  deleteGroupComment,
  getCommentsByGroupId,
  getGroupCommentsCount,
  getUserGroupComments,
} from '../../src/controllers/groupCommentsController.js';

import * as model from '../../src/models/groupCommentsModel.js';
import { mockReq, mockRes } from '../helpers/testUtils.js';

jest.mock('../../src/models/groupCommentsModel.js');

describe('groupCommentsController', () => {
  let req, res;

  beforeEach(() => {
    req = mockReq({ user: { userId: 1 } });
    res = mockRes();
    jest.clearAllMocks();
  });

  describe('getGroupComments', () => {
    it('should return all group comments', async () => {
      model.getAllGroupComments.mockResolvedValue([]);

      await getGroupComments(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should return 500 on error', async () => {
      model.getAllGroupComments.mockRejectedValue(new Error());

      await getGroupComments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getGroupCommentById', () => {
    it('should return comment', async () => {
      req.params.id = '1';
      model.getGroupCommentById.mockResolvedValue({ id: 1 });

      await getGroupCommentById(req, res);

      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return 404 if not found', async () => {
      req.params.id = '1';
      model.getGroupCommentById.mockResolvedValue(null);

      await getGroupCommentById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createGroupComment', () => {
    it('should create group comment', async () => {
      req.body = { group_id: 2, content: 'hello' };
      
      model.isUserMemberOfGroup.mockResolvedValue(true);
      model.addGroupComment.mockResolvedValue({ id: 1 });

      await createGroupComment(req, res);

      expect(model.addGroupComment).toHaveBeenCalledWith({
        user_id: 1,
        group_id: 2,
        content: 'hello',
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 if missing fields', async () => {
      req.body = {};

      await createGroupComment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('updateGroupComment', () => {
    it('should update own comment', async () => {
      req.params.id = '1';
      req.body = { content: 'updated' };

      model.getGroupCommentById.mockResolvedValue({ id: 1, user_id: 1 });
      model.updateGroupComment.mockResolvedValue({ id: 1 });

      await updateGroupComment(req, res);

      expect(res.json).toHaveBeenCalled();
    });

    it('should return 403 if not owner', async () => {
      req.params.id = '1';
      model.getGroupCommentById.mockResolvedValue({ user_id: 2 });

      await updateGroupComment(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('patchGroupComment', () => {
    it('should patch own comment', async () => {
      req.params.id = '1';
      req.body = { content: 'patched' };

      model.getGroupCommentById.mockResolvedValue({ user_id: 1 });
      model.patchGroupComment.mockResolvedValue({});

      await patchGroupComment(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('deleteGroupComment', () => {
    it('should delete own comment', async () => {
      req.params.id = '1';

      model.getGroupCommentById.mockResolvedValue({ user_id: 1 });
      model.deleteGroupComment.mockResolvedValue({ id: 1 });

      await deleteGroupComment(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Comment deleted',
        deleted: { id: 1 },
      });
    });

    it('should return 403 if not owner', async () => {
      req.params.id = '1';
      model.getGroupCommentById.mockResolvedValue({ user_id: 2 });

      await deleteGroupComment(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('other getters', () => {
    it('should return comments by group id', async () => {
      req.params.groupId = '1';
      model.getCommentsByGroupId.mockResolvedValue([]);

      await getCommentsByGroupId(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should return comments count', async () => {
      req.params.groupId = '1';
      model.countGroupComments.mockResolvedValue(5);

      await getGroupCommentsCount(req, res);

      expect(res.json).toHaveBeenCalledWith(5);
    });

    it('should return user group comments', async () => {
      req.params = { userId: '1', groupId: '2' };
      model.getUserCommentsInGroup.mockResolvedValue([]);

      await getUserGroupComments(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });
  });
});