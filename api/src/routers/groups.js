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
  inviteMember,
  acceptInvitation,
  declineInvitation,
  removeMember,
  getGroupMembers,
  requestJoinGroup,
  getJoinRequests,
  acceptJoinRequest,
  declineJoinRequest 
} from "../controllers/groupsController.js";
import * as membersController from "../controllers/groupMembersController.js";
import { auth } from "../middleware/auth.js";
import multer from "multer";


const router = express.Router();


const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });


router.get("/", getGroups);
router.get("/:id", getGroupById);
router.post("/", auth, upload.single("avatar"), createGroup);
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

router.post("/:groupId/invite-member", auth, inviteMember);  // Invite someone
router.post("/:id/request-join", auth, requestJoinGroup);  // Request to join group
router.post("/invitations/:id/accept", auth, acceptInvitation);
router.post("/invitations/:id/decline", auth, declineInvitation);

// User clicks "Send Invite" → request sent to group owner
router.post("/:id/request-join", auth, requestJoinGroup);
// Owner sees pending join requests (Group details page)
router.get("/:id/join-requests", auth, getJoinRequests);
// Owner accepts join request
router.post("/:groupId/join-requests/:requestId/accept", auth, acceptJoinRequest);
// Owner declines join request
router.post("/:groupId/join-requests/:requestId/decline", auth, declineJoinRequest);


router.get("/:groupId/members", auth, membersController.getMembers);
router.post("/:groupId/members", auth, membersController.addMember);
router.delete("/:groupId/members/:userId", auth, membersController.removeMember);
router.delete("/:groupId/leave", auth, membersController.leaveGroup);


export default router;