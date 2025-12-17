import {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  patchComment,
  deleteComment,
} from '../../src/controllers/commentsController.js';

import * as commentsModel from '../../src/models/commentsModel.js';
import { mockReq, mockRes } from '../helpers/testUtils.js';

jest.mock('../../src/models/commentsModel.js');

describe('commentsController', () => {
  let req, res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    jest.clearAllMocks();
  });

  describe('getComments', () => {
    it('should return all comments', async () => {
      const mockComments = [{ id: 1, text: 'Hello' }];
      commentsModel.getAllComments.mockResolvedValue(mockComments);

      await getComments(req, res);

      expect(commentsModel.getAllComments).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockComments);
    });

    it('should return 500 on error', async () => {
      commentsModel.getAllComments.mockRejectedValue(new Error('DB error'));

      await getComments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('getCommentById', () => {
    it('should return comment by id', async () => {
      const mockComment = { id: 1, text: 'Test' };
      req.params.id = '1';

      commentsModel.getCommentById.mockResolvedValue(mockComment);

      await getCommentById(req, res);

      expect(commentsModel.getCommentById).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockComment);
    });

    it('should return 404 if comment not found', async () => {
      req.params.id = '1';
      commentsModel.getCommentById.mockResolvedValue(null);

      await getCommentById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Comment not found',
      });
    });

    it('should return 500 on error', async () => {
      req.params.id = '1';
      commentsModel.getCommentById.mockRejectedValue(new Error('DB error'));

      await getCommentById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('createComment', () => {
    it('should create a comment', async () => {
      const mockComment = { id: 1, text: 'New comment' };
      req.body = { text: 'New comment' };

      commentsModel.addComment.mockResolvedValue(mockComment);

      await createComment(req, res);

      expect(commentsModel.addComment).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockComment);
    });

    it('should return 500 on error', async () => {
      commentsModel.addComment.mockRejectedValue(new Error('DB error'));

      await createComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('updateComment', () => {
    it('should update a comment', async () => {
      const updated = { id: 1, text: 'Updated' };
      req.params.id = '1';
      req.body = { text: 'Updated' };

      commentsModel.updateComment.mockResolvedValue(updated);

      await updateComment(req, res);

      expect(commentsModel.updateComment).toHaveBeenCalledWith('1', req.body);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('should return 404 if comment not found', async () => {
      req.params.id = '1';
      commentsModel.updateComment.mockResolvedValue(null);

      await updateComment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Comment not found',
      });
    });

    it('should return 500 on error', async () => {
      req.params.id = '1';
      commentsModel.updateComment.mockRejectedValue(new Error('DB error'));

      await updateComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('patchComment', () => {
    it('should patch a comment', async () => {
      const patched = { id: 1, text: 'Patched' };
      req.params.id = '1';
      req.body = { text: 'Patched' };

      commentsModel.patchComment.mockResolvedValue(patched);

      await patchComment(req, res);

      expect(commentsModel.patchComment).toHaveBeenCalledWith('1', req.body);
      expect(res.json).toHaveBeenCalledWith(patched);
    });

    it('should return 404 if comment not found or no fields provided', async () => {
      req.params.id = '1';
      commentsModel.patchComment.mockResolvedValue(null);

      await patchComment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Comment not found or no fields provided',
      });
    });

    it('should return 500 on error', async () => {
      req.params.id = '1';
      commentsModel.patchComment.mockRejectedValue(new Error('DB error'));

      await patchComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      const deleted = { id: 1 };
      req.params.id = '1';

      commentsModel.deleteComment.mockResolvedValue(deleted);

      await deleteComment(req, res);

      expect(commentsModel.deleteComment).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({
        message: 'Comment deleted',
        comment: deleted,
      });
    });

    it('should return 404 if comment not found', async () => {
      req.params.id = '1';
      commentsModel.deleteComment.mockResolvedValue(null);

      await deleteComment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Comment not found',
      });
    });

    it('should return 500 on error', async () => {
      req.params.id = '1';
      commentsModel.deleteComment.mockRejectedValue(new Error('DB error'));

      await deleteComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });
});