import express from 'express';
import * as qnaController from '../controller/qnaController.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', isAuth, qnaController.uploadFiles, qnaController.writeQuestion);
router.get('/best', isAuth);
router.get('/new', isAuth, qnaController.getNewQuestions);
router.get('/old', isAuth);
router.delete('/:id', isAuth, qnaController.deleteQuestion);
router.put('/:id', isAuth, qnaController.uploadFiles, qnaController.updateQuestion);
router.get('/me', isAuth, qnaController.viewMyQuestions);
router.get('/:type/:name', isAuth, qnaController.viewQuestionList);
router.get('/:id', isAuth, qnaController.viewQuestionDetail);
router.post('/:id/answers', isAuth, qnaController.uploadFiles, qnaController.writeAnswer);

export default router;
