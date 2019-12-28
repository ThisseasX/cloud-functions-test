import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { isUser } from './user';
import { respond } from '../utils';

const usersRef = admin.firestore().collection('users');

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const collection = await usersRef.get();
    const docs = collection.docs.map(doc => doc.data());

    respond(res, docs);
  } catch (err) {
    respond(res, err.message, 500);
  }
};

const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    respond(res, 'ID parameter required', 400);
    return;
  }

  try {
    const doc = await usersRef.doc(id).get();

    if (!doc.exists) {
      respond(res, `User with id: ${id} does not exist`, 404);
      return;
    }

    respond(res, doc.data());
  } catch (err) {
    respond(res, err.message, 500);
  }
};

const getUserByName = async (req: Request, res: Response) => {
  const name = req.params.name;

  if (!name) {
    respond(res, 'Name parameter required', 400);
    return;
  }

  try {
    const result = await usersRef
      .where('name', '==', name)
      .limit(1)
      .get();

    const data = result.docs[0].data();

    respond(res, data);
  } catch (err) {
    respond(res, err.message, 500);
  }
};

const addUser = async (req: Request, res: Response) => {
  if (!isUser(req.body)) {
    respond(res, 'Bad Request', 400);
    return;
  }

  try {
    await usersRef.doc().create(req.body);

    respond(res, req.body);
  } catch (err) {
    respond(res, err.message, 500);
  }
};

const deleteUserById = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    respond(res, 'ID parameter required', 400);
    return;
  }

  try {
    const doc = await usersRef.doc(id).get();

    if (!doc.exists) {
      respond(res, `User with id: ${id} does not exist`, 404);
      return;
    }

    await doc.ref.delete();

    respond(res, doc.data());
  } catch (err) {
    respond(res, err.message, 500);
  }
};

const deleteUserByName = async (req: Request, res: Response) => {
  const name = req.params.name;

  if (!name) {
    respond(res, 'Name parameter required', 400);
    return;
  }

  try {
    const result = await usersRef
      .where('name', '==', name)
      .limit(1)
      .get();

    if (result.empty) {
      respond(res, `User with name: ${name} does not exist`);
      return;
    }

    const doc = result.docs[0];

    await doc.ref.delete();

    respond(res, doc.data());
  } catch (err) {
    respond(res, err.message, 500);
  }
};

export {
  getAllUsers,
  getUserById,
  getUserByName,
  addUser,
  deleteUserById,
  deleteUserByName,
};
