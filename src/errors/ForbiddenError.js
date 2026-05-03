import ApiError from './ApiError.js';

export default class ForbiddenError extends ApiError {
  constructor(mensagem) {
    super(mensagem, 403);
  }
}
