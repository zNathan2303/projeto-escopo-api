import z from 'zod';
import * as registroModel from '../models/registro.model.js';
import { transformarUndefinedOuStringVaziaEmNull } from '../utils/formatacoes.js';

const projetoIdParam = z.coerce
  .number({ error: 'O ID de projeto deve ser um número' })
  .positive({ error: 'O ID de projeto deve ser positivo' });

const registroSchema = z.object({
  titulo: z
    .string({ error: 'Deve ser uma String' })
    .trim()
    .min(1, { error: 'Mínimo 1 caractere' })
    .max(150, { error: 'Máximo 150 caracteres' }),
  conteudo: z.preprocess(
    transformarUndefinedOuStringVaziaEmNull,
    z.string({ error: 'Deve ser uma String' }).nullable(),
  ),
});

export async function obterRegistrosDeUmProjeto(projetoId, usuario) {
  const id = projetoIdParam.parse(projetoId);
  const usuarioId = usuario.id;

  const registros = await registroModel.obterTodosDeUmProjeto(id, usuarioId);

  return registros;
}

export async function criarRegistro(requestBody, projeto_id, usuario) {
  const registro = registroSchema.parse(requestBody);
  const projetoId = projetoIdParam.parse(projeto_id);
  const usuarioId = usuario.id;

  const registroId = await registroModel.criar({
    conteudo: registro.conteudo,
    projetoId,
    usuarioId,
    titulo: registro.titulo,
  });

  return registroId;
}
