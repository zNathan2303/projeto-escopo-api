import z from 'zod';
import * as usuarioConvidadoModel from '../models/usuario-convidado.model.js';
import * as zodParam from '../utils/zod-param.js';
import { transformarUndefinedOuStringVaziaEmNull } from '../utils/formatacoes.js';
import BadRequestError from '../errors/BadRequestError.js';

const usuarioConvidadoSchema = z.object({
  cargo: z.preprocess(
    transformarUndefinedOuStringVaziaEmNull,
    z
      .string({ error: 'Deve ser uma String' })
      .max(100, { error: 'Máximo de 100 caracteres' })
      .nullable(),
  ),
  usuario_id: z
    .number({ error: 'O ID de usuário deve ser um número' })
    .positive({ error: 'O ID de usuário deve ser positivo' }),
});

export async function criarUsuarioConvidado({ requestBody, reuniaoIdParam }) {
  const reuniaoId = zodParam.reuniaoId.parse(reuniaoIdParam);
  const { cargo, usuario_id } = usuarioConvidadoSchema.parse(requestBody);

  const resultadoBanco = await usuarioConvidadoModel.criar({
    cargo,
    reuniaoId,
    usuarioId: usuario_id,
  });

  if (resultadoBanco.affectedRows === 0) {
    throw new BadRequestError('Usuário não encontrado');
  }
}

export async function excluirUsuarioConvidado(usuarioConvidadoIdParam) {
  const usuarioConvidadoId = zodParam.usuarioConvidadoIdParam.parse(usuarioConvidadoIdParam);

  const resultadoBanco = await usuarioConvidadoModel.excluir(usuarioConvidadoId);

  if (resultadoBanco.affectedRows === 0) {
    throw new BadRequestError('Registro de usuário convidado não encontrado');
  }
}
