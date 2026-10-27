import { Router } from "express";
import { signup } from "./auth.controller.js";

const router = Router();

// Request an OTP to sign up with email.
router.post("/signup", signup);

export default router;