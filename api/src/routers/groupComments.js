import express from "express";
import {auth} from "../middleware/auth.js"
import {
  getGroupComments,
  getGroupCommentById,
  createGroupComment,
  updateGroupComment,
  patchGroupComment,
  deleteGroupComment,
  getCommentsByGroupId,
  getGroupCommentsCount,
  getUserGroupComments
} from "../controllers/groupCommentsController.js";

const router = express.Router();

router.get("/", getGroupComments);
router.get("/:id", auth, getGroupCommentById);
router.post("/", auth, createGroupComment);
router.put("/:id", auth, updateGroupComment);
router.patch("/:id", auth, patchGroupComment);
router.delete("/:id", auth, deleteGroupComment);
router.get("/group/:groupId", auth, getCommentsByGroupId);
router.get("/group/:groupId/count", auth, getGroupCommentsCount);
router.get("/group/:groupId/user/:userId", auth, getUserGroupComments);

export default router;


