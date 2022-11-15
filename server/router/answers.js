import express from 'express';
import * as qnaController from '../controller/qnaController.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id/recommend', isAuth, qnaController.recommendAnswer);

export default router;
