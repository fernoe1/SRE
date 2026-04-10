import express from 'express';

import { loginUser, signupUser, getUserById, updateUserProfile, verifyUser, sendMail } from '../controllers/userController.js';
import { validateSignup } from '../middleware/validate.js';
import { requireAuth } from '../middleware/authorize.js';

const router = express.Router();

router.post("/signin", loginUser);

router.post("/signup", validateSignup, signupUser);

router.get("/verify", verifyUser);

router.post("/sendmail", requireAuth, sendMail);

router.get("/:id", requireAuth, getUserById);

router.put("/", requireAuth, updateUserProfile);

export default router;