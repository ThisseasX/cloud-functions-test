import { Router } from 'express';
import { getFileByName, uploadFile } from './file.service';

const fileRoute = Router();

fileRoute
  .get('/:name', getFileByName)
  .post('/', uploadFile);

export default fileRoute;
