import { SERVER_ERROR } from '../constants';

export default class ServerError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = SERVER_ERROR;
  }
}
