import * as memberModel from "../models/groupMembersModel.js";
import * as groupModel from "../models/groupsModel.js";

async function isOwner(userId, groupId) {
    const group = await groupModel.getGroupById(groupId);
    return group && group.owner_id == userId;
}

export const addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { user_id, role } = req.body;

    const owner = await isOwner(req.user.id, groupId);
    if (!owner) {
      return res.status(403).json({ error: "Only group owner can add members" });
    }

    const member = await memberModel.addMember(groupId, user_id, role);
    if (!member) {
      return res.status(409).json({ error: "User already in group" });
    }

    res.status(201).json(member);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const removeMember = async (req, res) => {
    try {
        const { groupId, userId } = req.params;

        const owner = await isOwner(req.user.id, groupId);
        if (!owner) {
            return res.status(403).json({ error: "Only group owner can remove members" });
        }

        const removed = await memberModel.removeMember(groupId, userId);
        if (!removed) {
            return res.status(404).json({ error: "User not in group" });
        }

        res.json({ message: "Member removed", removed });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error"});
    }
};

export const getMembers = async (req, res) => {
    try {
        const members = await memberModel.getGroupMembers(req.params.groupId);
        res.json(members);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error"});
    }
};

export const leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.id;

        const group = await groupModel.getGroupById(groupId);
        if (!group) return res.status(404).json({ error: "Group not found"});

        if (group.owner_id === userId) {
            return res.status(403).json({
                error: "Owner cannot leave the group. Transfer ownership or delete the group."
            });
        }

        const removed = await memberModel.removeMember(groupId, userId);
        if (!removed) {
            return res.status(400).json({ error: "You are not a member of this group" });
        }

        res.json({ message: "You have left the group successfully"})
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error"});
    }
};

