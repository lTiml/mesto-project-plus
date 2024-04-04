import { Response } from 'express';
import User from '../models/user';
import { IRequest } from '../types';
import { REQUEST_SUCCESS, VALIDATION_ERROR, DATA_NOT_FOUND, SERVER_ERROR } from '../constants';

export const createUser = (req: IRequest, res: Response) => {
  const { name, about, avatar } = req.body;
  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.status(REQUEST_SUCCESS).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

export const getUsers = (req: IRequest, res: Response) => {
  User.find({}).orFail(new Error('No one user found!'))
    .then((user) => res.status(REQUEST_SUCCESS).send({ data: user }))
    .catch((error) => res.status(SERVER_ERROR).send({ message: `Произошла ошибка: ${error}` }));
};

export const getUserById = (req: IRequest, res: Response) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) { return res.status(DATA_NOT_FOUND).send({ message: 'Пользователь не найден' }); }
      return res.status(REQUEST_SUCCESS).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при удалении карточки' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

export const updateUser = (req: IRequest, res: Response) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) { return res.status(DATA_NOT_FOUND).send({ message: 'Пользователь не найден' }); }
      return res.status(REQUEST_SUCCESS).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные при обновлении профиля' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

export const updateAvatar = (req: IRequest, res: Response) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) { return res.status(DATA_NOT_FOUND).send({ message: 'Пользователь не найден' }); }
      return res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};
