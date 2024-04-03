import { Response } from 'express';
import Card from '../models/cards';
import { IRequest } from '../types';
import { REQUEST_SUCCESS, VALIDATION_ERROR, SERVER_ERROR, DATA_NOT_FOUND } from '../constants';

export const createCard = (req: IRequest, res: Response) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user?._id,
  })
    .then((card) => res.status(REQUEST_SUCCESS).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

export const getCards = (req: IRequest, res: Response) => {
  Card.find({})
    .then((cards) => res.status(REQUEST_SUCCESS).send({ data: cards }))
    .catch((error) => res.status(SERVER_ERROR).send({ message: `${error}:Ошибка на сервере` }));
};

export const deleteCard = (req: IRequest, res: Response) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(DATA_NOT_FOUND).send({ message: 'Карточка пользователя не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные при удалении карточки' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

export const likeCard = (req: IRequest, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(DATA_NOT_FOUND).send({ message: 'Карточка пользователя не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

export const dislikeCard = (req: IRequest, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(DATA_NOT_FOUND).send({ message: 'Карточка пользователя не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};
