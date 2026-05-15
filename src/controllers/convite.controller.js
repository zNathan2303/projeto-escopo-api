import z from 'zod';
import * as conviteModel from '../models/convite.model.js';
import { transformarUndefinedOuStringVaziaEmNull } from '../utils/formatacoes.js';
import NotFoundError from '../errors/NotFoundError.js';
import * as zodParam from '../utils/zod-param.js';
import BadRequestError from '../errors/BadRequestError.js';
import ApiError from '../errors/ApiError.js';

export async function atualizarConviteStatus({ requestBody, conviteIdParam, usuarioId }) {
  const id = zodParam.conviteId.parse(id);
  const { novoStatusId } = zodParam.conviteStatusId.parse(requestBody.convite_status_id);
  // const { usuarioId } = zodParam.usuarioId.parse(requestBody.usuario_id);
  // Desabilitei essa validação, na rota de dashboard ele nao confere id vindo do token.
  // Se quiser trocar é só substituir usuarioId aqui por novoUsuarioId

  const resultadoBanco = await conviteModel.atualizarConviteStatus;
  ({
    conviteId: conviteId,
    usuarioId: usuarioId,
    novoStatusId: novoStatusId,
  });

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Não foi possível atualizar o conteúdo do registro');
  }
}
