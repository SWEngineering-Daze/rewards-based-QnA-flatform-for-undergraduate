import express from 'express';
import * as authController from '../controller/authController.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/verifyUser', authController.verifyUser);
router.post('/login', authController.login);
router.get('/me', isAuth, authController.me);

export default router;
