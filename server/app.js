import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { config } from './config.js';
import authRouter from './router/auth.js';
import * as listController from './controller/listController.js';
import { Course, Department } from './database/mongodb.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);
app.get('/departments', listController.getDepartments);
app.get('/courses', listController.getCourses);

app.get('/', (req, res) => {
  res.json({
    message: '프론트의 신 변찬혁..',
  });
});

app.get('/test', async (req, res) => {
  const courses = [
    '소프트웨어공학개론',
    '데이터베이스프로그래밍',
    '웹프로그래밍',
    '암호학과네트워크보안',
    '데이터통신입문',
    '컴퓨터알고리즘과실습',
    '공개SW프로젝트',
    '컴파일러구성',
    '컴퓨터구조',
    '인공지능',
    '시스템소프트웨어와실습',
    '컴퓨터공학종합설계2',
    '계산적사고법',
  ];

  const CSE = await Department.findOne({ name: '컴퓨터공학전공' }).exec();

  console.log(CSE);

  courses.forEach((course) => {
    console.log(course);
    const newCourse = new Course({
      parent: CSE._id,
      name: course,
    });

    newCourse.save();
  });
});

app.listen(config.SERVER_PORT, () => {
  console.log(`server is running on port ${config.SERVER_PORT}`);
});
