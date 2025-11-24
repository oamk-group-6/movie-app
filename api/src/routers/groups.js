import express from "express";
import { 
  getGroups, 
  getGroupById, 
  createGroup, 
  updateGroup, 
  deleteGroup,
  patchGroup,
  getMyGroups,
  getDiscoverGroups,
  getInvitations,
  joinGroup,
  leaveGroup,
  inviteUser,
  acceptInvitation,
  declineInvitation,
  removeMember,
  getGroupMembers 
} from "../controllers/groupsController.js";
import * as membersController from "../controllers/groupMembersController.js";
import { auth } from "../middleware/auth.js";

import { auth } from "../middleware/auth.js";


const router = express.Router();

router.get("/", getGroups);
router.get("/:id", getGroupById);
router.post("/", auth, createGroup);
router.put("/:id", updateGroup);
router.patch("/:id", patchGroup);
router.delete("/:id", deleteGroup);


router.get("/my/all", auth, getMyGroups);                  // My Groups
router.get("/discover/all", auth, getDiscoverGroups);      // Discover Groups
router.get("/invitations/all", auth, getInvitations);      // Invitations

router.post("/:id/join", auth, joinGroup);                 // Join group
router.post("/:id/leave", auth, leaveGroup);               // Leave group
router.delete("/:groupId/members/:userId", auth, removeMember); // Remove member
router.get("/:id/members", auth, getGroupMembers); // Get group members



router.post("/invite/user", auth, inviteUser);             // Invite someone
router.post("/invitations/:id/accept", auth, acceptInvitation);
router.post("/invitations/:id/decline", auth, declineInvitation);

router.get("/:groupId/members", auth, membersController.getMembers);
router.post("/:groupId/members", auth, membersController.addMember);
router.delete("/:groupId/members/:userId", auth, membersController.removeMember);
router.delete("/:groupId/leave", auth, membersController.leaveGroup);


export default router;