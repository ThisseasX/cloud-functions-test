import './admin';
import * as express from 'express';
import userRoute from './user';
import * as cors from 'cors';

const app = express();

app
  .use(cors({ origin: true }))
  .use('/users', userRoute);

export default app;
