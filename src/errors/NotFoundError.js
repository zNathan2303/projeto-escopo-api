import ApiError from './ApiError.js';

export default class NotFoundError extends ApiError {
  constructor(mensagem = 'Recurso não encontrado') {
    super(mensagem, 404);
  }
}
