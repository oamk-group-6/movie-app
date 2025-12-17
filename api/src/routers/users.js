
import express from "express";
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  changePassword,
  deleteAvatar,
  patchUser,
  searchUsersByUsername,
  uploadAvatar,
  getMe
} from "../controllers/usersController.js";
import { auth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/search", auth, searchUsersByUsername);

router.get("/", auth, getUsers);
router.get("/me", auth, getMe);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.patch("/:id", patchUser);
router.patch("/:id/password", changePassword);
router.delete("/:id", auth, deleteUser,);
router.delete("/:id/avatar", deleteAvatar);


// Profiilikuvan lataus
router.post("/:id/avatar", upload.single("avatar"), uploadAvatar);

export default router;
