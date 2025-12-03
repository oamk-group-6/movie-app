import express from "express";
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
router.get("/:id", getGroupCommentById);
router.post("/", createGroupComment);
router.put("/:id", updateGroupComment);
router.patch("/:id", patchGroupComment);
router.delete("/:id", deleteGroupComment);
router.get("/group/:groupId", getCommentsByGroupId);
router.get("/group/:groupId/count", getGroupCommentsCount);
router.get("/group/:groupId/user/:userId", getUserGroupComments);

export default router;


