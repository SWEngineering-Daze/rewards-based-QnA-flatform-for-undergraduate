import express from 'express';
import * as qnaController from '../controller/qnaController.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', isAuth, qnaController.viewMyAnswers);
router.post('/:id/recommend', isAuth, qnaController.recommendAnswer);
router.delete('/:id', isAuth, qnaController.deleteAnswer);

export default router;
