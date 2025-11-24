import * as groupsModel from "../models/groupsModel.js";

export const getGroups = async (req, res) => {
    try {
        const groups = await groupsModel.getAllGroups();
        res.json(groups);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Database error"});
    }
};

export const getGroupById = async (req, res) => {
  try {
    const group = await groupsModel.getGroupById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });

    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const createGroup = async (req, res) => {
  try {
    const ownerId = req.user.userId; // from token

    if (!ownerId) {
      return res.status(401).json({ error: "User authentication failed" });
    }

    const newGroup = await groupsModel.addGroup({
      name: req.body.name,
      description: req.body.description,
      avatar_url: req.body.avatar_url,
      owner_id: ownerId
    });

    await groupsModel.addMember(ownerId, newGroup.id, "owner");//add owner as member

    res.status(201).json(newGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const updatedGroup = await groupsModel.updateGroup(req.params.id, req.body);
    if (!updatedGroup) return res.status(404).json({ error: "Group not found" });
    res.json(updatedGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const patchGroup = async (req, res) => {
  try {
    const updated = await groupsModel.patchGroup(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Group not found or no fields provided" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const deletedGroup = await groupsModel.deleteGroup(req.params.id);
    if (!deletedGroup) return res.status(404).json({ error: "Group not found" });
    res.json({ message: "Group deleted", group: deletedGroup });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groups = await groupsModel.getMyGroups(userId);
    res.json(groups);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getDiscoverGroups = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groups = await groupsModel.getDiscoverGroups(userId);
    res.json(groups);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getInvitations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const invites = await groupsModel.getInvitations(userId);
    res.json(invites);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groupId = req.params.id;

    const joined = await groupsModel.joinGroup(groupId, userId);
    res.json({ joined: !!joined });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groupId = req.params.id;

    const left = await groupsModel.leaveGroup(groupId, userId);
    res.json({ left: !!left });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const inviteUser = async (req, res) => {
  try {
    const invitedBy = req.user.userId;
    const { groupId, invitedUserId } = req.body;

    const invite = await groupsModel.inviteUser({
      groupId,
      invitedUserId,
      invitedBy
    });

    res.json(invite);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const acceptInvitation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const inviteId = req.params.id;

    const success = await groupsModel.acceptInvite(inviteId, userId);
    if (!success) return res.status(404).json({ error: "Invite not found" });

    res.json({ accepted: true });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const declineInvitation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const inviteId = req.params.id;

    const success = await groupsModel.declineInvite(inviteId, userId);
    if (!success) return res.status(404).json({ error: "Invite not found" });

    res.json({ declined: true });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    // owneria ei saa poistaa
    const group = await groupsModel.getGroupById(groupId);
    if (group.owner_id == userId) {
      return res.status(400).json({ error: "Cannot remove the group owner" });
    }

    const removed = await groupsModel.removeMember(userId, groupId);

    if (!removed) {
      return res.status(404).json({ error: "Member not found in this group" });
    }

    res.json({ message: "Member removed successfully" });
  } catch (err) {
    console.error("Remove member error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getGroupMembers = async (req, res) => {
  try {
    const members = await groupsModel.getGroupMembers(req.params.id);
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};
