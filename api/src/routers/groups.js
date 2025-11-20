import express from "express";
import { 
  getGroups, 
  getGroupById, 
  createGroup, 
  updateGroup, 
  deleteGroup,
  patchGroup 
} from "../controllers/groupsController.js";
import * as membersController from "../controllers/groupMembersController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getGroups);
router.get("/:id", getGroupById);
router.post("/", createGroup);
router.put("/:id", updateGroup);
router.patch("/:id", patchGroup);
router.delete("/:id", deleteGroup);

router.get("/:groupId/members", auth, membersController.getMembers);
router.post("/:groupId/members", auth, membersController.addMember);
router.delete("/:groupId/members/:userId", auth, membersController.removeMember);
router.delete("/:groupId/leave", auth, membersController.leaveGroup);

export default router;