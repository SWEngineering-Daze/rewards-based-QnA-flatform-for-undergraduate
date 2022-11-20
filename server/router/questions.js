import express from 'express';
import * as qnaController from '../controller/qnaController.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', isAuth, qnaController.uploadFiles, qnaController.writeQuestion);
router.get('/me', isAuth, qnaController.viewMyQuestions);
router.get('/:type/:name', isAuth, qnaController.viewQuestionList);
router.get('/:id', isAuth, qnaController.viewQuestionDetail);
router.post('/:id/answers', isAuth, qnaController.writeAnswer);

export default router;
