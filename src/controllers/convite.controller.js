import z from 'zod';
import * as conviteModel from '../models/convite.model.js';
import * as zodParam from '../utils/zod-param.js';
import BadRequestError from '../errors/BadRequestError.js';
import ApiError from '../errors/ApiError.js';

const atualizarConviteSchema = z.object({
  novo_status_id: z
    .number({ error: 'Deve ser um número' })
    .positive({ error: 'Deve ser positivo' }),
});

export async function atualizarConviteStatus({
  conviteIdParam,
  requestBody,
  usuarioId,
  statusAtualId,
}) {
  const conviteId = zodParam.conviteId.parse(conviteIdParam);
  const { novo_status_id } = atualizarConviteSchema.parse(requestBody);

  // Caso o convite não seja pendente(1) ou não-lido(4) não é possivel alterar
  if (statusAtualId !== 1 && statusAtualId !== 4) {
    throw new BadRequestError('Convite inválido para alteração');
  }

  // Caso o convite seja pendente(1) ele só pode ser recusado(2) ou aceito(6)
  if (statusAtualId === 1 && novo_status_id !== 2 && novo_status_id !== 6) {
    throw new BadRequestError('Status de convite inválido para esse convite');
  }

  // Caso o convite seja não-lido(4) ele só pode ser lido(5)
  if (statusAtualId === 4 && novo_status_id !== 5) {
    throw new BadRequestError('Status de convite inválido para esse convite');
  }

  try {
    const resultadoBanco = await conviteModel.atualizarConviteStatus({
      conviteId: conviteId,
      usuarioId: usuarioId,
      novoStatusId: novo_status_id,
    });

    if (resultadoBanco.affectedRows === 0) {
      throw new ApiError('Não foi possível atualizar o conteúdo do registro');
    }
  } catch (error) {
    // Erro lançado pela procedure
    if (error.sqlState === '45000') {
      throw new BadRequestError(error.sqlMessage);
    }

    throw error;
  }
}
