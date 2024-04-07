import { NextFunction, Request, Response, Router } from 'express';
import userRouter from './user';
import cardsRouter from './cards';
import NotFoundError from '../errors/NotFoundError';

const routes = Router();
routes.use('/users', userRouter);
routes.use('/cards', cardsRouter);
routes.use((req: Request, res: Response, next: NextFunction) => next(new NotFoundError('Page not found')));

export default routes;
