import z from 'zod';
import * as convidadoReuniaoModel from '../models/convidado-reuniao.model.js';
import * as zodParam from '../utils/zod-param.js';
import { transformarUndefinedOuStringVaziaEmNull } from '../utils/formatacoes.js';
import ApiError from '../errors/ApiError.js';

const criarConvidadoSchema = z.object({
  nome: z
    .string({ error: 'Deve ser uma String' })
    .min(1, { error: 'Mínimo 1 caractere' })
    .max(100, { error: 'Máximo 100 caracteres' }),
  cargo: z.preprocess(
    transformarUndefinedOuStringVaziaEmNull,
    z
      .string({ error: 'Deve ser uma String' })
      .max(100, { error: 'Máximo 100 caracteres' })
      .nullable(),
  ),
});

export async function criarConvidado({ requestBody, reuniaoIdParam }) {
  const reuniaoId = zodParam.reuniaoId.parse(reuniaoIdParam);
  const { cargo, nome } = criarConvidadoSchema.parse(requestBody);

  const resultadoBanco = await convidadoReuniaoModel.criar({ cargo, nome, reuniaoId });

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Não foi possível criar o convidado');
  }
}
