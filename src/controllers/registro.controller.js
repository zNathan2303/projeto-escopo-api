import z from 'zod';
import * as registroModel from '../models/registro.model.js';
import { transformarUndefinedOuStringVaziaEmNull } from '../utils/formatacoes.js';
import ForbiddenError from '../errors/ForbiddenError.js';

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

export async function criarRegistro(requestBody, projetoId, usuario) {
  const { conteudo, titulo } = registroSchema.parse(requestBody);
  const projeto_id = projetoIdParam.parse(projetoId);
  const criador_id = usuario.id;

  const resultadoBanco = await registroModel.criar({
    titulo,
    conteudo,
    projeto_id,
    criador_id,
  });

  if (resultadoBanco.affectedRows === 0) {
    throw new ForbiddenError('Não possui permissão para acessar esse recurso');
  }

  const registroId = resultadoBanco.insertId;

  return registroId;
}
