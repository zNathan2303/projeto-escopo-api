import BadRequestError from '../errors/BadRequestError.js';

export function tratarRequestBodyInvalido(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && err.type === 'entity.parse.failed') {
    throw new BadRequestError('Requisição mal formulada');
  }

  next(err);
}

export function verificarSeRequestTemBody(req, res, next) {
  if (!req.body) {
    throw new BadRequestError('Requisição está sem o body');
  }

  next();
}
