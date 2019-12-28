import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { isUser } from './user';

const userRef = admin.firestore().collection('users');

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const data = await userRef.get();

    res.json({
      success: true,
      data: data.docs.map(item => item.data()),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const data = await userRef.doc(id).get();

    res.json({
      success: true,
      data: data.data(),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getUserByName = async (req: Request, res: Response) => {
  const name = req.params.name;

  try {
    const data = await userRef
      .where('name', '==', name)
      .limit(1)
      .get();

    res.json({
      success: true,
      data: data.docs.map(item => item.data())[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const addUser = async (req: Request, res: Response) => {
  if (!isUser(req.body)) {
    res.status(400).json({
      success: false,
      message: 'Bad Request',
    });
    return;
  }

  try {
    await userRef.doc().set(req.body);

    res.json({
      success: true,
      data: req.body,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUserById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const a = await userRef.doc(id).delete();

    console.log(a);

    res.json({
      success: true,
      data: id,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUserByName = async (req: Request, res: Response) => {
  const name = req.params.name;

  try {
    const data = await userRef
      .where('name', '==', name)
      .limit(1)
      .get();

    await data.docs[0].ref.delete();

    res.json({
      success: true,
      data: name,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
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
