import express from "express";
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  changePassword,
  patchUser
} from "../controllers/usersController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);   // for admin, not for registration
router.put("/:id", updateUser);
router.patch("/:id", patchUser);
router.patch("/:id/password", changePassword);
router.delete("/:id", deleteUser);

export default router;
