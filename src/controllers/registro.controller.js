import z from 'zod';
import * as registroModel from '../models/registro.model.js';

const idParam = z.coerce
  .number({ error: 'O ID de projeto deve ser um número' })
  .positive({ error: 'O ID de projeto deve ser positivo' });

export async function obterRegistrosDeUmProjeto(projetoId, usuario) {
  const id = idParam.parse(projetoId);
  const usuarioId = usuario.id;

  const registros = await registroModel.obterTodosDeUmProjeto(id, usuarioId);

  return registros;
}
