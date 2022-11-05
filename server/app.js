import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { config } from './config.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World',
  });
});

app.listen(config.PORT, () => {
  console.log(`server is running on port ${config.PORT}`);
});
