import express from 'express';
import * as authController from '../controller/authController.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/verifyUser', authController.verifyUser);

export default router;
