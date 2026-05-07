import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/UnauthorizedError.js';
import * as usuarioProjetoModel from '../models/usuario-projeto.model.js';
import NotFoundError from '../errors/NotFoundError.js';
import * as zodParam from '../utils/zod-param.js';

export function validarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('Não autenticado');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = payload;
    next();
  } catch (err) {
    throw new UnauthorizedError('Token inválido ou expirado');
  }
}

export async function validarAcesso(req, res, next) {
  const usuarioID = req.usuario.id;
  const projetoID = zodParam.projetoID.parse(req.params.projetoID);

  const temPermissao = await usuarioProjetoModel.verificarParticipacaoDoUsuarioNoProjeto({
    projetoID,
    usuarioID,
  });

  if (!temPermissao) {
    throw new NotFoundError('Não foi encontrado o projeto com o ID informado');
  }

  next();
}
