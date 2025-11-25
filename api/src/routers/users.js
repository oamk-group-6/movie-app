import express from "express";
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  changePassword,
  patchUser,
  searchUsersByUsername
} from "../controllers/usersController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/search", auth, searchUsersByUsername);

router.get("/", auth, getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.patch("/:id", patchUser);
router.patch("/:id/password", changePassword);
router.delete("/:id", auth, deleteUser);

export default router;
