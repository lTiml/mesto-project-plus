import express, { Application } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import auth from './middlewares/auth';
import { MONGO_URL, PORT } from './constants';
import routes from './routes/index';
import { createUser, login } from './controllers/user';
import { loggerError, loggerRequest } from './middlewares/logger';
import { validateCreateUser, validateLogin } from './validator/validator';
import errorHandler from './middlewares/error-handler';

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(MONGO_URL, {})
  .then(() => {
    console.log('Подключение к MongoDB успешно');
  })
  .catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
  });

app.use(loggerRequest);
app.use(loggerError);

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);
app.use(routes);

app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
