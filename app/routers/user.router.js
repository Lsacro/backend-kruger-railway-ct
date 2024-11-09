import express from "express";
import {
  saveUser,
  getAllUsers,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", saveUser);
router.get("/all-users", getAllUsers);
router.delete("/:id", deleteUser);

export default router;
