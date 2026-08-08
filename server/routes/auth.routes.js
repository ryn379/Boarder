import express from "express";
import {
  register,
  login,
  logout,
  refresh,
} from "../controllers/auth/auth.controller.js";

const router = express.Router();

// /api/auth
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);

export default router;
