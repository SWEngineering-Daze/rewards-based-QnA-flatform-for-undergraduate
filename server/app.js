import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { config } from './config.js';
import authRouter from './router/auth.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);

app.post('/test', (req, res) => {
  const depts = [
    {
      parent: {
        id: 1,
        name: '공과대학',
      },
      name: '컴퓨터공학과',
    },
    {
      parent: {
        id: 1,
        name: '공과대학',
      },
      name: '정보통신공학과',
    },
    {
      parent: {
        id: 2,
        name: '예술대학',
      },
      name: '조소학과',
    },
    {
      parent: {
        id: 2,
        name: '예술대학',
      },
      name: '서양화과',
    },
  ];

  depts.forEach((element) => {
    console.log(element);
  });

  res.json(depts);
  // const newUser = new User({ email: token.email, password: token.password });
  // await newUser.save();
});

app.use('/', (req, res) => {
  res.json({
    message: '프론트의 신 변찬혁..',
  });
});

app.listen(config.SERVER_PORT, () => {
  console.log(`server is running on port ${config.SERVER_PORT}`);
});
