import z from 'zod';
import * as reuniaoUsuarioModel from '../models/reuniao-usuario.model.js';
import * as zodParam from '../utils/zod-param.js';
import { transformarUndefinedOuStringVaziaEmNull } from '../utils/formatacoes.js';
import BadRequestError from '../errors/BadRequestError.js';
import ApiError from '../errors/ApiError.js';

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

export async function criarRelacaoEmReuniaoUsuario({ requestBody, reuniaoIdParam }) {
  const reuniaoId = zodParam.reuniaoId.parse(reuniaoIdParam);
  const { cargo, usuario_id } = usuarioConvidadoSchema.parse(requestBody);

  const resultadoBanco = await reuniaoUsuarioModel.criar({
    cargo,
    reuniaoId,
    usuarioId: usuario_id,
  });

  if (resultadoBanco.affectedRows === 0) {
    throw new BadRequestError('Usuário não encontrado');
  }

  return { id: resultadoBanco.insertId };
}

export async function excluirReuniaoUsuario(reuniaoUsuarioIdParam) {
  const reuniaoUsuarioId = zodParam.reuniaoUsuarioId.parse(reuniaoUsuarioIdParam);

  const resultadoBanco = await reuniaoUsuarioModel.excluir(reuniaoUsuarioId);

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Não foi possível excluir a relação entre reunião e usuário');
  }
}
