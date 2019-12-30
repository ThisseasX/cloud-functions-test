import './admin';
import * as express from 'express';
import userRoute from './user';
import fileRoute from './file';
import * as cors from 'cors';

const app = express();

app
  .use(cors({ origin: true }))
  .use('/users', userRoute)
  .use('/files', fileRoute);

export default app;
