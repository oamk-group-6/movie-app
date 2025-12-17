import * as groupsModel from '../../src/models/groupsModel.js';
import pool from '../../src/database.js';

jest.mock('../../src/database.js', () => ({
  __esModule: true,
  default: { query: jest.fn() }
}));

describe('groupsModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllGroups', () => {
    it('returns all groups', async () => {
      const mockGroups = [{ id: 1, name: 'Group 1' }];
      pool.query.mockResolvedValue({ rows: mockGroups });

      const result = await groupsModel.getAllGroups();
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM groups ORDER BY created_at DESC");
      expect(result).toEqual(mockGroups);
    });
  });

  describe('getGroupById', () => {
    it('returns group by id', async () => {
      const mockGroup = { id: 1, name: 'Group 1' };
      pool.query.mockResolvedValue({ rows: [mockGroup] });

      const result = await groupsModel.getGroupById(1);
      expect(result).toEqual(mockGroup);
    });
  });

  describe('addGroup', () => {
    it('inserts a group', async () => {
      const group = { name: 'G', description: 'Desc', avatar_url: '/img', owner_id: 1 };
      const mockRow = { id: 1, ...group };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await groupsModel.addGroup(group);
      expect(result).toEqual(mockRow);
    });
  });

  describe('updateGroup', () => {
    it('updates a group', async () => {
      const group = { name: 'New', description: 'Desc', avatar_url: '/img' };
      const mockRow = { id: 1, ...group };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await groupsModel.updateGroup(1, group);
      expect(result).toEqual(mockRow);
    });
  });

  describe('patchGroup', () => {
    it('patches group fields', async () => {
      const fields = { name: 'Patch' };
      const mockRow = { id: 1, name: 'Patch' };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await groupsModel.patchGroup(1, fields);
      expect(result).toEqual(mockRow);
    });

    it('returns null if no fields', async () => {
      const result = await groupsModel.patchGroup(1, {});
      expect(result).toBeNull();
    });
  });

  describe('deleteGroup', () => {
    it('deletes group', async () => {
      const mockRow = { id: 1, name: 'Group' };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await groupsModel.deleteGroup(1);
      expect(result).toEqual(mockRow);
    });
  });

  describe('getMyGroups', () => {
    it('returns user groups', async () => {
      const mockRows = [{ id: 1, name: 'Group', user_role: 'owner' }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await groupsModel.getMyGroups(1);
      expect(pool.query).toHaveBeenCalled();
      expect(result).toEqual(mockRows);
    });
  });

  describe('getDiscoverGroups', () => {
    it('returns discoverable groups', async () => {
      const mockRows = [{ id: 2, name: 'Other Group' }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await groupsModel.getDiscoverGroups(1);
      expect(result).toEqual(mockRows);
    });
  });

  describe('getInvitations', () => {
    it('returns invitations', async () => {
      const mockRows = [{ id: 1, group_id: 2 }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await groupsModel.getInvitations(1);
      expect(result).toEqual(mockRows);
    });
  });

  describe('joinGroup', () => {
    it('adds user to group', async () => {
      const mockRow = { user_id: 1, group_id: 2 };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await groupsModel.joinGroup(2, 1);
      expect(result).toEqual(mockRow);
    });
  });

  describe('leaveGroup', () => {
    it('removes user from group', async () => {
      const mockRow = { user_id: 1, group_id: 2 };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await groupsModel.leaveGroup(2, 1);
      expect(result).toEqual(mockRow);
    });
  });

  describe('inviteUser', () => {
    it('creates group invitation', async () => {
      const invite = { group_id: 1, invited_user_id: 2, invited_by_user_id: 1 };
      const mockRow = { id: 1, ...invite };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await groupsModel.inviteUser({ groupId: 1, invitedUserId: 2, invitedBy: 1 });
      expect(result).toEqual(mockRow);
    });
  });

  describe('isUserMember', () => {
    it('returns true if member', async () => {
      pool.query.mockResolvedValue({ rows: [1] });
      const result = await groupsModel.isUserMember(1, 1);
      expect(result).toBe(true);
    });

    it('returns false if not member', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await groupsModel.isUserMember(1, 1);
      expect(result).toBe(false);
    });
  });

  describe('hasPendingInvite', () => {
    it('returns true if pending', async () => {
      pool.query.mockResolvedValue({ rows: [1] });
      const result = await groupsModel.hasPendingInvite(1, 1);
      expect(result).toBe(true);
    });

    it('returns false if none', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await groupsModel.hasPendingInvite(1, 1);
      expect(result).toBe(false);
    });
  });

  describe('createJoinRequest', () => {
    it('creates join request', async () => {
      const mockRow = { id: 1, user_id: 1, group_id: 2 };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await groupsModel.createJoinRequest(1, 2);
      expect(result).toEqual(mockRow);
    });
  });

  describe('acceptInvite', () => {
    it('accepts invitation and adds member', async () => {
      const mockInvite = { id: 1, group_id: 2 };
      pool.query.mockResolvedValueOnce({ rows: [mockInvite] }); // update invitation
      pool.query.mockResolvedValueOnce({ rows: [{ user_id: 1, group_id: 2 }] }); // insert member

      const result = await groupsModel.acceptInvite(1, 1);
      expect(result).toEqual(mockInvite);
    });

    it('returns null if invite not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await groupsModel.acceptInvite(999, 1);
      expect(result).toBeNull();
    });
  });

  describe('declineInvite', () => {
    it('deletes invitation', async () => {
      const mockRow = { id: 1 };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await groupsModel.declineInvite(1);
      expect(result).toEqual(mockRow);
    });
  });

  describe('getGroupMembers', () => {
    it('returns members', async () => {
      const mockRows = [{ id: 1, username: 'Alice', role: 'owner' }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await groupsModel.getGroupMembers(1);
      expect(result).toEqual(mockRows);
    });
  });

  describe('removeMember', () => {
    it('removes member', async () => {
      const mockRow = { user_id: 1, group_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await groupsModel.removeMember(1, 1);
      expect(result).toEqual(mockRow);
    });
  });

  describe('getJoinRequests', () => {
    it('returns pending join requests', async () => {
      const mockRows = [{ id: 1, user_id: 2 }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await groupsModel.getJoinRequests(1);
      expect(result).toEqual(mockRows);
    });
  });

  describe('acceptJoinRequest', () => {
    it('accepts join request and adds member', async () => {
      const mockRequest = { id: 1, user_id: 2, group_id: 3 };
      pool.query
        .mockResolvedValueOnce({ rows: [mockRequest] }) // get request
        .mockResolvedValueOnce({ rows: [] }) // update request
        .mockResolvedValueOnce({ rows: [] }); // add member

      const result = await groupsModel.acceptJoinRequest(1);
      expect(result).toEqual(mockRequest);
    });

    it('returns null if request not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await groupsModel.acceptJoinRequest(999);
      expect(result).toBeNull();
    });
  });

  describe('declineJoinRequest', () => {
    it('deletes join request', async () => {
      const mockRow = { id: 1 };
      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await groupsModel.declineJoinRequest(1);
      expect(result).toEqual(mockRow);
    });
  });
});