import z from 'zod';
import * as reuniaoModel from '../models/reuniao.model.js';
import * as zodParam from '../utils/zod-param.js';
import ApiError from '../errors/ApiError.js';

const criarReuniaoSchema = z.object({
  titulo: z
    .string({ error: 'Deve ser uma String' })
    .min(1, { error: 'Mínimo 1 caractere' })
    .max(150, { error: 'Máximo 150 caracteres' }),
});

export async function obterReunioesPorProjetoId(projetoIdParam) {
  const projetoId = zodParam.projetoId.parse(projetoIdParam);

  const reunioes = await reuniaoModel.obterPorProjetoId(projetoId);

  return reunioes;
}

export async function criarReuniao({ requestBody, projetoIdParam }) {
  const projetoId = zodParam.projetoId.parse(projetoIdParam);
  const { titulo } = criarReuniaoSchema.parse(requestBody);

  const resultadoBanco = await reuniaoModel.criar({ projetoId, titulo });

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Não foi possível criar a reunião');
  }
}
