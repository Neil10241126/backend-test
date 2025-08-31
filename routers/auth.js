import express from 'express';
import { signUp, login, logout, refreshToken } from '../controllers/authController.js';
import { signUpSchema } from '../schemas/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/sign-up', validate(signUpSchema), signUp)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh-token', refreshToken)

export default router;