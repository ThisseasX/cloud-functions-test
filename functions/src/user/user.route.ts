import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  getUserByName,
  addUser,
  deleteUserById,
  deleteUserByName,
} from './user.service';

const userRoute = Router();

userRoute
  .get('/', getAllUsers)
  .get('/:id', getUserById)
  .get('/name/:name', getUserByName)
  .post('/', addUser)
  .delete('/:id', deleteUserById)
  .delete('/name/:name', deleteUserByName);

export default userRoute;
