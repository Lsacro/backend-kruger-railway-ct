import express from "express";
import {
  saveUser,
  getAllUsers,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", saveUser);
router.get("/", getAllUsers);
router.delete("/:id", deleteUser);

export default router;
