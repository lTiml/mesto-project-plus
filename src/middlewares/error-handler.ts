import { ErrorRequestHandler } from 'express';

const errorHandler:ErrorRequestHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  const message = statusCode === 500 ? 'На сервере произошла ошибка' : error.message;
  res.status(statusCode).send({ message });
  next();
};

export default errorHandler;
