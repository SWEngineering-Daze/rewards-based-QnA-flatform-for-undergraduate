import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { config } from './config.js';
import authRouter from './router/auth.js';
import { Department } from './database/mongodb.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);

app.get('/deparements', async (req, res) => {
  //   const depts = [
  //     {
  //       parent: {
  //         id: 1,
  //         name: '공과대학',
  //       },
  //       name: '컴퓨터공학과',
  //     },
  //     {
  //       parent: {
  //         id: 2,
  //         name: '불교대학',
  //       },
  //     },
  //     {
  //       parent: {
  //         id: 3,
  //         name: '문과대학',
  //       },
  //     },
  //     {
  //       parent: {
  //         id: 4,
  //         name: '이과대학',
  //       },
  //     },
  //     {
  //       parent: {
  //         id: 5,
  //         name: '법과대학',
  //       },
  //     },
  //     {
  //       parent: {
  //         id: 6,
  //         name: '사회과학대학',
  //       },
  //     },
  //     {
  //       parent: {
  //         id: 7,
  //         name: '경찰사법대학',
  //       },
  //     },
  //     {
  //       parent: {
  //         id: 8,
  //         name: '경영대학',
  //       },
  //     },
  //     {
  //       parent: {
  //         id: 9,
  //         name: '바이오시스템대학',
  //       },
  //     },
  //     {
  //       parent: {
  //         id: 10,
  //         name: '사범대학',
  //       },
  //     },
  //     {
  //       parent: {
  //         id: 11,
  //         name: '약학대학',
  //       },
  //     },
  //   ];

  //   for (let element of depts) {
  //     console.log(element);

  //     const newDept = new Department(element);

  //     (async () => {
  //       await newDept.save();
  //     })();
  //   }

  const depts = await Department.find()
    .sort({
      'parent.id': 1,
    })
    .exec();

  console.log(depts);
});

app.use('/', (req, res) => {
  res.json({
    message: '프론트의 신 변찬혁..',
  });
});

app.listen(config.SERVER_PORT, () => {
  console.log(`server is running on port ${config.SERVER_PORT}`);
});
