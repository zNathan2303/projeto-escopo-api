import z from 'zod';
import * as notificacaoModel from '../models/notificacao.model.js';
import { transformarUndefinedOuStringVaziaEmNull } from '../utils/formatacoes.js';
import NotFoundError from '../errors/NotFoundError.js';
import * as zodParam from '../utils/zod-param.js';
import BadRequestError from '../errors/BadRequestError.js';
import ApiError from '../errors/ApiError.js';

export async function obterNotificacoesPorUsuarioId(usuarioId) {
  const notificacoes = await notificacaoModel.obterTodasPorUsuarioId(usuarioId);

  return notificacoes;
}

export async function abrirNotificacao({ notificacaoIdParam }) {
  const notificacaoId = zodParam.notificacaoId.parse(notificacaoIdParam);

  const resultadoBanco = await notificacaoModel.abrirNotificacao({
    notificacaoId,
  });

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Não foi possível atualizar a notificação');
  }
}
