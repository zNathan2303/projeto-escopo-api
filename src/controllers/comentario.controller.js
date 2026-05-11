import z from 'zod';
import * as comentarioModel from '../models/comentario.model.js';
import { transformarUndefinedEmNull } from '../utils/formatacoes.js';

const criarComentarioSchema = z.object({
  conteudo: z
    .string({ error: 'Deve ser uma String' })
    .trim()
    .min(1, { error: 'Mínimo 1 caractere' }),
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
    .positive({ error: 'O ID do tipo de comentário deve ser positivo' }),
});

export async function criarComentario({ requestBody, documentoId, usuarioId }) {
  const { comentario_tipo_id, conteudo, parent_id, registro_referencia_id } =
    criarComentarioSchema.parse(requestBody);

  const resultadoBanco = await comentarioModel.criar({
    conteudo,
    criadorId: usuarioId,
    documentoId,
    parentId: parent_id,
    registroReferenciaId: registro_referencia_id,
    tipoComentarioId: comentario_tipo_id,
  });

  // if (resultadoBanco.affectedRows === 0) {
  //   throw new
  // }

  const { insertId } = resultadoBanco;

  return insertId;
}
