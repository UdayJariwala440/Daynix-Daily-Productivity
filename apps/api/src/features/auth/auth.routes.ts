import { Router } from "express";
import {
  getCurrentUserController,
  listSessionsController,
  login,
  logoutController,
  refreshTokenController,
  resendOtpController,
  revokeOtherSessionsController,
  revokeSessionController,
  signup,
  verifyOtpController,
} from "./auth.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", resendOtpController);
router.post("/login", login);
router.get("/me", authenticateToken, getCurrentUserController);
router.post("/refresh", refreshTokenController);
router.post("/logout", logoutController);
router.get("/sessions", authenticateToken, listSessionsController);
router.delete(
  "/sessions/others",
  authenticateToken,
  revokeOtherSessionsController,
);
router.delete(
  "/sessions/:sessionId",
  authenticateToken,
  revokeSessionController,
);

export default router;
