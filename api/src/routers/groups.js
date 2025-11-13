import express from "express";
import { 
  getGroups, 
  getGroupById, 
  createGroup, 
  updateGroup, 
  deleteGroup,
  patchGroup 
} from "../controllers/groupsController.js";

const router = express.Router();

router.get("/", getGroups);
router.get("/:id", getGroupById);
router.post("/", createGroup);
router.put("/:id", updateGroup);
router.patch("/:id", patchGroup);
router.delete("/:id", deleteGroup);

export default router;