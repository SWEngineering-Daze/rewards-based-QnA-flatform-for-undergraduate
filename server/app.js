import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { config } from './config.js';
import authRouter from './router/auth.js';
import * as listController from './controller/listController.js';
import { Course, Department, Question, TodayPoint } from './database/mongodb.js';
import * as qnaController from './controller/qnaController.js';
import { isAuth } from './middleware/auth.js';
import usersRouter from './router/users.js';
import { getPointsOfToday } from './controller/pointController.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.get('/departments', listController.getDepartments);
app.get('/courses', listController.getCourses);
app.post('/questions', isAuth, qnaController.writeQuestion);
app.get('/questions/:type/:name', isAuth, qnaController.viewQuestionList);
app.get('/questions/:id', isAuth, qnaController.viewQuestionDetail);
app.post('/questions/:id/answers', isAuth, qnaController.writeAnswer);
app.get('/points/today', getPointsOfToday);

app.get('/', (req, res) => {
  res.json({ message: '프론트의 신 변찬혁..' });
});

app.get('/test', async (req, res) => {});

app.listen(config.SERVER_PORT, () => {
  console.log(`server is running on port ${config.SERVER_PORT}`);
});
