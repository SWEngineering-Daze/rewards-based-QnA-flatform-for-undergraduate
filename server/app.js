import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { config } from './config.js';
import authRouter from './router/auth.js';
import { Course, Department } from './database/mongodb.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);

app.get('/departments', async (req, res) => {
  const departments = await Department.find()
    .sort({
      'parent.id': 1,
    })
    .exec();

  res.json(departments);
});

app.get('/courses', async (req, res) => {
  const courses_with_depts = await Course.find().populate('parent').exec();

  res.json(courses_with_depts);
});

app.get('/', (req, res) => {
  res.json({
    message: '프론트의 신 변찬혁..',
  });
});

app.listen(config.SERVER_PORT, () => {
  console.log(`server is running on port ${config.SERVER_PORT}`);
});
