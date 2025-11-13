import express from "express";
import { 
  getLists, 
  getListById, 
  createList, 
  updateList, 
  deleteList,
  patchList 
} from "../controllers/listsController.js";

const router = express.Router();

router.get("/", getLists);
router.get("/:id", getListById);
router.post("/", createList);
router.put("/:id", updateList);
router.patch("/:id", patchList);
router.delete("/:id", deleteList);

export default router;