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
import * as fileController from './controller/fileController.js';
import { Item, Partner } from './database/mongodb.js';

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
app.get('/files/:id', isAuth, fileController.downloadFileById);
app.get('/items', isAuth, pointController.getItems);
app.post('/items/:id', isAuth, pointController.exchangeItem);

app.get('/', (req, res) => {
  res.json({ message: '프론트의 신 변찬혁..' });
});

app.get('/test', async (req, res) => {
  const item = await Item.create({
    name: '자바칩프라푸치노',
    url: './test/javachip.jpg',
    price: 4500,
  });

  const partner = await Partner.create({
    name: '스타벅스',
    url: './test/starbucks.jpg',
    items: [{ _id: item._id }],
  });

  res.json(partner);
});

app.listen(config.SERVER_PORT, () => {
  console.log(`server is running on port ${config.SERVER_PORT}`);
});
