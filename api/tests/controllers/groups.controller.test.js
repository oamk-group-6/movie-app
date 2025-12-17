import * as groupsController from '../../src/controllers/groupsController.js';
import * as groupsModel from '../../src/models/groupsModel.js';
import { mockReq, mockRes } from '../helpers/testUtils.js';

jest.mock('../../src/models/groupsModel.js');

describe('groupsController', () => {
  let req, res;

  beforeEach(() => {
    req = mockReq({ user: { userId: 1 } });
    res = mockRes();
    jest.clearAllMocks();
  });

  describe('getGroups', () => {
    it('returns all groups', async () => {
      groupsModel.getAllGroups.mockResolvedValue([{ id: 1 }]);

      await groupsController.getGroups(req, res);

      expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    it('returns 500 on error', async () => {
      groupsModel.getAllGroups.mockRejectedValue(new Error());

      await groupsController.getGroups(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getGroupById', () => {
    it('returns group', async () => {
      req.params.id = '1';
      groupsModel.getGroupById.mockResolvedValue({ id: 1 });

      await groupsController.getGroupById(req, res);

      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('returns 404 if not found', async () => {
      req.params.id = '1';
      groupsModel.getGroupById.mockResolvedValue(null);

      await groupsController.getGroupById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createGroup', () => {
    it('creates group and adds owner as member', async () => {
      req.body = { name: 'Group', description: 'Desc' };
      req.file = { filename: 'avatar.png' };

      groupsModel.addGroup.mockResolvedValue({ id: 1, owner_id: 1 });
      groupsModel.addMember.mockResolvedValue(true);

      await groupsController.createGroup(req, res);

      expect(groupsModel.addGroup).toHaveBeenCalled();
      expect(groupsModel.addMember).toHaveBeenCalledWith(1, 1, 'owner');
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('returns 401 if no userId', async () => {
      req.user = {};

      await groupsController.createGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('updateGroup', () => {
    it('updates group if owner', async () => {
      req.params.id = '1';
      req.body = { name: 'Updated' };

      groupsModel.getGroupById.mockResolvedValue({ id: 1, owner_id: 1 });
      groupsModel.updateGroup.mockResolvedValue({ id: 1, name: 'Updated' });

      await groupsController.updateGroup(req, res);

      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Updated' });
    });

    it('returns 403 if not owner', async () => {
      req.params.id = '1';

      groupsModel.getGroupById.mockResolvedValue({ id: 1, owner_id: 2 });

      await groupsController.updateGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('deleteGroup', () => {
    it('deletes group if owner', async () => {
      req.params.id = '1';

      groupsModel.getGroupById.mockResolvedValue({ id: 1, owner_id: 1 });
      groupsModel.deleteGroup.mockResolvedValue({ id: 1 });

      await groupsController.deleteGroup(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Group deleted',
        group: { id: 1 },
      });
    });

    it('returns 403 if not owner', async () => {
      req.params.id = '1';

      groupsModel.getGroupById.mockResolvedValue({ id: 1, owner_id: 2 });

      await groupsController.deleteGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('joinGroup', () => {
    it('joins group', async () => {
      req.params.id = '1';

      groupsModel.joinGroup.mockResolvedValue(true);

      await groupsController.joinGroup(req, res);

      expect(res.json).toHaveBeenCalledWith({ joined: true });
    });
  });

  describe('leaveGroup', () => {
    it('member can leave', async () => {
      req.params.id = '1';

      groupsModel.getGroupById.mockResolvedValue({ id: 1, owner_id: 2 });
      groupsModel.leaveGroup.mockResolvedValue(true);

      await groupsController.leaveGroup(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('owner cannot leave', async () => {
      req.params.id = '1';

      groupsModel.getGroupById.mockResolvedValue({ id: 1, owner_id: 1 });

      await groupsController.leaveGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('inviteMember', () => {
    it('owner can invite user', async () => {
      req.params.groupId = '1';
      req.body.username = 'bob';

      groupsModel.getGroupById.mockResolvedValue({ id: 1, owner_id: 1 });
      groupsModel.getUserByUsername.mockResolvedValue({ id: 2 });
      groupsModel.isUserMember.mockResolvedValue(false);
      groupsModel.hasPendingJoinRequest.mockResolvedValue(false);
      groupsModel.hasPendingInvite.mockResolvedValue(false);
      groupsModel.inviteUser.mockResolvedValue({ id: 10 });

      await groupsController.inviteMember(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('requestJoinGroup', () => {
    it('creates join request', async () => {
      req.params.id = '1';
      req.user.userId = 2;

      groupsModel.getGroupById.mockResolvedValue({ id: 1, owner_id: 1 });
      groupsModel.isUserMember.mockResolvedValue(false);
      groupsModel.hasPendingJoinRequest.mockResolvedValue(false);
      groupsModel.hasPendingInvite.mockResolvedValue(false);
      groupsModel.createJoinRequest.mockResolvedValue({ id: 5 });

      await groupsController.requestJoinGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
});