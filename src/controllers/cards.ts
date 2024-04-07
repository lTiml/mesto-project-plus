import { NextFunction, Response } from 'express';
import Card from '../models/cards';
import { IRequest } from '../types';
import { REQUEST_SUCCESS, AUTH_SUCCESS } from '../constants';
import ValidationError from '../errors/ValidationError';
import NotFoundError from '../errors/NotFoundError';

export const createCard = (req: IRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user?._id,
  })
    .then((card) => res.status(AUTH_SUCCESS).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при создании карточки'));
      }
      next();
    });
};

export const getCards = (req: IRequest, res: Response, next: NextFunction) => {
  Card.find({}).orFail(new Error('No cards found!'))
    .then((cards) => res.status(REQUEST_SUCCESS).send({ data: cards }))
    .catch(next);
};

export const deleteCard = (req: IRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка пользователя не найдена'));
      }
      return res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные при удалении карточки'));
      }
      next(error);
    });
};

export const likeCard = (req: IRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка пользователя не найдена'));
      }
      return res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные для постановки лайка'));
      }
      next();
    });
};

export const dislikeCard = (req: IRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка пользователя не найдена'));
      }
      return res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные для снятия лайка'));
      }
      next();
    });
};
