import z from 'zod';
import * as comentarioModel from '../models/comentario.model.js';
import { transformarUndefinedEmNull } from '../utils/formatacoes.js';
import BadRequestError from '../errors/BadRequestError.js';
import * as zodParam from '../utils/zod-param.js';

const criarComentarioSchema = z.object({
  conteudo: z
    .string({ error: 'Deve ser uma String' })
    .trim()
    .min(1, { error: 'Mínimo 1 caractere' })
    .max(500, { error: 'Mínimo 500 caracteres' }),
  parent_id: z.preprocess(
    transformarUndefinedEmNull,
    z
      .number({ error: 'O parent_id deve ser um número ou nulo' })
      .positive({ error: 'O parent_id deve ser um número positivo ou nulo' })
      .nullable(),
  ),
  registro_referencia_id: z.preprocess(
    transformarUndefinedEmNull,
    z
      .number({ error: 'O ID do registro de referência deve ser um número ou nulo' })
      .positive({ error: 'O ID do registro de referência deve ser um número positivo ou nulo' })
      .nullable(),
  ),
  comentario_tipo_id: z
    .number({ error: 'O ID do tipo de comentário deve ser um número' })
    .positive({ error: 'O ID do tipo de comentário deve ser positivo' })
    .max(3, { error: 'O ID do tipo de comentário deve ser um número até 3' }),
});

export async function criarComentario({ requestBody, documentoId, usuarioId }) {
  const { comentario_tipo_id, conteudo, parent_id, registro_referencia_id } =
    criarComentarioSchema.parse(requestBody);

  if (comentario_tipo_id === 1 && (registro_referencia_id !== null || parent_id !== null)) {
    throw new BadRequestError(
      'Comentário padrão não aceita referência para registro nem para outro comentário',
    );
  }

  if (comentario_tipo_id === 2 && (registro_referencia_id !== null || parent_id === null)) {
    throw new BadRequestError(
      'Comentário do tipo resposta deve possuir referência para outro comentário (parent_id) e não deve possuir referência para algum registro',
    );
  }

  if (comentario_tipo_id === 3 && (registro_referencia_id === null || parent_id !== null)) {
    throw new BadRequestError(
      'Comentário do tipo sugestão deve possuir referência para algum registro e não deve possuir referência para outro comentário (parent_id)',
    );
  }

  try {
    const resultadoBanco = await comentarioModel.criar({
      conteudo,
      criadorId: usuarioId,
      documentoId,
      parentId: parent_id,
      registroReferenciaId: registro_referencia_id,
      tipoComentarioId: comentario_tipo_id,
    });

    return resultadoBanco.insertId;
  } catch (error) {
    // Erro lançado pela procedure
    if (error.sqlState === '45000') {
      throw new BadRequestError(error.sqlMessage);
    }

    throw error;
  }
}

export async function obterComentariosPorDocumentoId(documentoIdParam) {
  const documentoId = zodParam.documentoId.parse(documentoIdParam);

  const comentarios = await comentarioModel.obterPorDocumentoId(documentoId);

  return comentarios;
}
