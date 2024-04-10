import { model, Schema, Document, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import NotAuthError from '../errors/NotAuthError';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<Document<unknown, any, IUser>>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (link: string) => {
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
          link,
        );
      },
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (value: Schema.Types.Mixed) => validator.isEmail(value as unknown as string),
      message: 'Incorrect type of email',
    },
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.static(
  'findUserByCredentials',
  function findUserByCredentials(
    email: string,
    password: string,
  ) {
    return this.findOne({ email }).select('+password')
      .then((user: IUser | null) => {
        if (!user) {
          return Promise.reject(new NotAuthError('Неверная почта или пароль'));
        }
        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            return Promise.reject(new NotAuthError('Неправильный пароль или пароль'));
          }
          return user;
        });
      });
  },
);

export default model<IUser, UserModel>('user', userSchema);
