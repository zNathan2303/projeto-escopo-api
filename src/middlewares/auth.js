import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/UnauthorizedError.js';
import ForbiddenError from '../errors/ForbiddenError.js';
import * as zodParam from '../utils/zod-param.js';
import * as usuarioProjetoModel from '../models/usuario-projeto.model.js';
import * as conviteModel from '../models/convite.model.js';
import * as notificacaoModel from '../models/notificacao.model.js';
import NotFoundError from '../errors/NotFoundError.js';
import BadRequestError from '../errors/BadRequestError.js';

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

export function validarPermissao(niveisPermitidos) {
  return (req, res, next) => {
    const nivelAcessoId = req.usuario.nivelAcessoId;

    if (!niveisPermitidos.includes(nivelAcessoId)) {
      throw new ForbiddenError('Não possui permissão para acessar esse recurso');
    }

    next();
  };
}

// Middlewares para validar acesso do usuario por determinado item

export async function validarAcessoPorDocumentoId(req, res, next) {
  const usuarioId = req.usuario.id;
  const documentoId = zodParam.documentoId.parse(req.params.documentoId);

  const participacao = await usuarioProjetoModel.verificarParticipacaoPorDocumentoId({
    documentoId,
    usuarioId,
  });

  if (!participacao) {
    throw new NotFoundError('Não foi encontrado o documento com o ID informado');
  }

  req.usuario.nivelAcessoId = participacao.nivel_acesso_id;

  next();
}

export async function validarAcessoPorProjetoId(req, res, next) {
  const usuarioId = req.usuario.id;
  const projetoId = zodParam.projetoId.parse(req.params.projetoId);

  const participacao = await usuarioProjetoModel.verificarParticipacaoPorProjetoId({
    projetoId,
    usuarioId,
  });

  if (!participacao) {
    throw new NotFoundError('Não foi encontrado o projeto com o ID informado');
  }

  req.usuario.nivelAcessoId = participacao.nivel_acesso_id;

  next();
}

export async function validarAcessoPorRegistroId(req, res, next) {
  const usuarioId = req.usuario.id;
  const registroId = zodParam.registroId.parse(req.params.registroId);

  const participacao = await usuarioProjetoModel.verificarParticipacaoPorRegistroId({
    registroId,
    usuarioId,
  });

  if (!participacao) {
    throw new NotFoundError('Não foi encontrado o registro com o ID informado');
  }

  req.usuario.nivelAcessoId = participacao.nivel_acesso_id;

  next();
}

export async function validarAcessoPorConviteId(req, res, next) {
  const usuarioId = req.usuario.id;
  const conviteId = zodParam.conviteId.parse(req.params.conviteId);

  const convidado = await conviteModel.validarDestinatarioPorConviteId({
    conviteId,
    usuarioId,
  });

  if (!convidado) {
    throw new NotFoundError('Não foi encontrado o convite com o ID informado');
  }

  req.conviteStatusAtualId = convidado.convite_status_id;

export async function validarAcessoPorNotificacaoId(req, res, next) {
  const usuarioId = req.usuario.id;
  const notificacaoId = zodParam.notificacaoId.parse(req.params.notificacaoId);

  const notificado = await notificacaoModel.verificarUsuarioPorNotificacaoId({
    notificacaoId,
    usuarioId,
  });

  if (!notificado) {
    throw new NotFoundError('Não foi encontrado a notificação com o ID informado');
  }

  next();
}

export async function validarAcessoPorCategoriaId(req, res, next) {
  const usuarioId = req.usuario.id;
  const categoriaId = zodParam.categoriaId.parse(req.params.categoriaId);

  const participacao = await usuarioProjetoModel.verificarParticipacaoPorCategoriaId({
    categoriaId,
    usuarioId,
  });

  if (!participacao) {
    throw new NotFoundError('Não foi encontrado a categoria com o ID informado');
  }

  req.usuario.nivelAcessoId = participacao.nivel_acesso_id;

  next();
}

export async function validarAcessoPorDocumentoVersaoId(req, res, next) {
  const usuarioId = req.usuario.id;
  const documentoVersaoId = zodParam.documentoVersaoId.parse(req.params.documentoVersaoId);

  const participacao = await usuarioProjetoModel.verificarParticipacaoPorDocumentoVersaoId({
    documentoVersaoId,
    usuarioId,
  });

  if (!participacao) {
    throw new NotFoundError('Não foi encontrado a versão do documento com o ID informado');
  }

  req.usuario.nivelAcessoId = participacao.nivel_acesso_id;

  next();
}
