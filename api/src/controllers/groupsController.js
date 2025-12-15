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

    const avatarUrl = req.file ? `/uploads/${req.file.filename}` : `/uploads/group_placeholder.png`;

    const newGroup = await groupsModel.addGroup({
      name: req.body.name,
      description: req.body.description,
      avatar_url: avatarUrl,
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
    const requesterId = req.user.userId;
    const groupId = req.params.id;

    const group = await groupsModel.getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.owner_id !== requesterId) {
      return res.status(403).json({ error: "Only the owner can update group." });
    }

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
    const requesterId = req.user.userId;
    const groupId = req.params.id;

    const group = await groupsModel.getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.owner_id !== requesterId) {
      return res.status(403).json({ error: "Only the owner can update group." });
    }
    
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
    const userId = req.user.userId;
    const groupId = req.params.id;

    const group = await groupsModel.getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.owner_id !== userId) {
      return res.status(403).json({ error: "Only the owner can delete the group" });
    }

    const deletedGroup = await groupsModel.deleteGroup(groupId);
    
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

    const group = await groupsModel.getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.owner_id === userId) {
      return res.status(400).json({ error: "Owner cannot leave their group" });
    }

    const left = await groupsModel.leaveGroup(groupId, userId);
    
    if (!left) {
      return res.status(400).json({ error: "User was not a member of this group" });
    }

    res.json({ success: true });

  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const inviteMember = async (req, res) => {
  try {
    const invitedBy = req.user.userId;
    const { groupId } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const group = await groupsModel.getGroupById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    if(group.owner_id != invitedBy) {
      return res.status(403).json({ error: "Only the group owner can invite members" });
    }

    const user = await groupsModel.getUserByUsername(username);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    if (user.id === invitedBy) {
      return res.status(400).json({ error: "You cannot invite yourself" });
    }

    const isMember = await groupsModel.isUserMember(user.id, groupId);
    if(isMember) {
      return res.status(400).json({ error: "User is already a member" });
    }

    const hasJoinRequest = await groupsModel.hasPendingJoinRequest(user.id, groupId);
    if (hasJoinRequest) {
      return res.status(400).json({ error: "User already sent a join request." });
    }

    const alreadyInvited = await groupsModel.hasPendingInvite(user.id, groupId);
    if(alreadyInvited) {
      return res.status(400).json({ error: "User already has a pending invitation." });
    }

    const invite = await groupsModel.inviteUser({
      groupId,
      invitedUserId: user.id,
      invitedBy
    });

    res.status(201).json({ message: "Invite sent!",invite });
  
  } catch(err) {
    console.error("inviteMember error: ",err);
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
    const inviteId = req.params.id;

    const success = await groupsModel.declineInvite(inviteId);
    if (!success) return res.status(404).json({ error: "Invite not found" });

    res.json({ declined: true });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const removeMember = async (req, res) => {
  try {
    const requesterId = req.user.userId;
    const { groupId, userId } = req.params;

    // owneria ei saa poistaa
    const group = await groupsModel.getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.owner_id !== requesterId) {
      return res.status(403).json({ error: "Only the owner can remove members" });
    }
    
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

export const requestJoinGroup = async (req, res) => {
    try {
        const userId = req.user.userId;
        const groupId = req.params.id;

        const group = await groupsModel.getGroupById(groupId);
        if (!group) return res.status(404).json({ error: "Group not found" });

        if (group.owner_id === userId) {
            return res.status(400).json({ error: "You already own this group" });
        }

        const alreadyMember = await groupsModel.isUserMember(userId, groupId);
        if (alreadyMember) {
            return res.status(400).json({ error: "You are already a member" });
        }

        const pending = await groupsModel.hasPendingJoinRequest(userId, groupId);
        if (pending) {
            return res.status(400).json({ error: "Request already sent" });
        }

        const hasInvite = await groupsModel.hasPendingInvite(userId, groupId);
        if (hasInvite) {
          return res.status(400).json({ error: "You already have an invitation from this group." });
        }


        const request = await groupsModel.createJoinRequest(userId, groupId);

        res.status(201).json({ message: "Join request sent!", request });

    } catch (err) {
        console.error("requestJoinGroup error:", err);
        res.status(500).json({ error: "Database error" });
    }
};

export const getJoinRequests = async (req, res) => {
    try {
        const groupId = req.params.id;

        const group = await groupsModel.getGroupById(groupId);
        if (!group) return res.status(404).json({ error: "Group not found" });

        if (group.owner_id !== req.user.userId) {
            return res.status(403).json({ error: "Only the owner can view join requests" });
        }

        const requests = await groupsModel.getJoinRequests(groupId);
        res.json(requests);

    } catch (err) {
        console.error("getJoinRequests error:", err);
        res.status(500).json({ error: "Database error" });
    }
};

export const acceptJoinRequest = async (req, res) => {
    try {
        const { groupId, requestId } = req.params;

        const group = await groupsModel.getGroupById(groupId);
        if (!group) return res.status(404).json({ error: "Group not found" });

        if (group.owner_id !== req.user.userId) {
            return res.status(403).json({ error: "Only the owner can accept requests" });
        }

        const result = await groupsModel.acceptJoinRequest(requestId);
        if (!result) return res.status(404).json({ error: "Request not found" });

        res.json({ accepted: true });

    } catch (err) {
        console.error("acceptJoinRequest error:", err);
        res.status(500).json({ error: "Database error" });
    }
};

export const declineJoinRequest = async (req, res) => {
    try {
        const { groupId, requestId } = req.params;

        const group = await groupsModel.getGroupById(groupId);
        if (!group) return res.status(404).json({ error: "Group not found" });

        if (group.owner_id !== req.user.userId) {
            return res.status(403).json({ error: "Only the owner can decline requests" });
        }

        const result = await groupsModel.declineJoinRequest(requestId);
        if (!result) return res.status(404).json({ error: "Request not found" });

        res.json({ declined: true });

    } catch (err) {
        console.error("declineJoinRequest error:", err);
        res.status(500).json({ error: "Database error" });
    }
};
