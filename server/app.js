import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { config } from './config.js';
import authRouter from './router/auth.js';
import * as listController from './controller/listController.js';
import { isAuth } from './middleware/auth.js';
import usersRouter from './router/users.js';
import * as pointController from './controller/pointController.js';
import questionsRouter from './router/questions.js';
import answersRouter from './router/answers.js';
import { downloadFileById } from './controller/fileController.js';

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
app.use('/questions', questionsRouter);
app.use('/answers', answersRouter);
app.get('/points/today', pointController.getPointsOfToday);
app.get('/files/:id', isAuth, downloadFileById);

app.get('/', (req, res) => {
  res.json({ message: '프론트의 신 변찬혁..' });
});

app.get('/test', async (req, res) => {});

app.listen(config.SERVER_PORT, () => {
  console.log(`server is running on port ${config.SERVER_PORT}`);
});
