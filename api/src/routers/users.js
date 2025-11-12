import express from "express";
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from "../controllers/usersController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getUsers);//suojattu reitti, vaatii tokenin
router.get("/:id", getUserById);
router.post("/", createUser);   // for admin, not for registration
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
