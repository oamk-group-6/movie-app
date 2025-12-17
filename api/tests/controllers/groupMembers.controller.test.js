import {
  addMember,
  removeMember,
  getMembers,
  leaveGroup,
} from '../../src/controllers/groupMembersController.js';

import * as memberModel from '../../src/models/groupMembersModel.js';
import * as groupModel from '../../src/models/groupsModel.js';
import { mockReq, mockRes } from '../helpers/testUtils.js';

jest.mock('../../src/models/groupMembersModel.js');
jest.mock('../../src/models/groupsModel.js');

describe('groupMembersController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addMember', () => {
    it('should add member if user is owner', async () => {
      const req = mockReq({
        params: { groupId: '1' },
        body: { user_id: 2, role: 'member' },
      });
      const res = mockRes();

      groupModel.getGroupById.mockResolvedValue({ owner_id: 1 });
      memberModel.addMember.mockResolvedValue({ user_id: 2, role: 'member' });

      await addMember(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 403 if not owner', async () => {
      const req = mockReq({ params: { groupId: '1' } });
      const res = mockRes();

      groupModel.getGroupById.mockResolvedValue({ owner_id: 99 });

      await addMember(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return 409 if user already in group', async () => {
      const req = mockReq({
        params: { groupId: '1' },
        body: { user_id: 2, role: 'member' },
      });
      const res = mockRes();

      groupModel.getGroupById.mockResolvedValue({ owner_id: 1 });
      memberModel.addMember.mockResolvedValue(null);

      await addMember(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  describe('removeMember', () => {
    it('should remove member if owner', async () => {
      const req = mockReq({ params: { groupId: '1', userId: '2' } });
      const res = mockRes();

      groupModel.getGroupById.mockResolvedValue({ owner_id: 1 });
      memberModel.removeMember.mockResolvedValue({ userId: 2 });

      await removeMember(req, res);

      expect(res.json).toHaveBeenCalled();
    });

    it('should return 404 if member not found', async () => {
      const req = mockReq({ params: { groupId: '1', userId: '2' } });
      const res = mockRes();

      groupModel.getGroupById.mockResolvedValue({ owner_id: 1 });
      memberModel.removeMember.mockResolvedValue(null);

      await removeMember(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getMembers', () => {
    it('should return group members', async () => {
      const req = mockReq({ params: { groupId: '1' } });
      const res = mockRes();

      memberModel.getGroupMembers.mockResolvedValue([{ userId: 2 }]);

      await getMembers(req, res);

      expect(res.json).toHaveBeenCalledWith([{ userId: 2 }]);
    });
  });

  describe('leaveGroup', () => {
    it('should not allow owner to leave', async () => {
      const req = mockReq({ params: { groupId: '1' } });
      const res = mockRes();

      groupModel.getGroupById.mockResolvedValue({ owner_id: 1 });

      await leaveGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should allow member to leave', async () => {
      const req = mockReq({ params: { groupId: '1' } });
      const res = mockRes();

      groupModel.getGroupById.mockResolvedValue({ owner_id: 99 });
      memberModel.removeMember.mockResolvedValue(true);

      await leaveGroup(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });
});