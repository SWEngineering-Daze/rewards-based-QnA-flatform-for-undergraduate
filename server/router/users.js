import express from 'express';
import * as userController from '../controller/userController.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.put('/password', isAuth, userController.changePassword); //로그인 된 상태에서 비밀번호 변경
router.post('/find-password', userController.findPassword); // 잊어버린 비밀번호 찾기 요청
router.put('/reset-password', userController.resetPassword); // 토큰이 포함된 링크를 통해 새로운 비밀번호 설정

export default router;
