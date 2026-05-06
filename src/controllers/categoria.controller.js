import z from 'zod';
import * as categoriaModel from '../models/categoria.model.js';
import NotFoundError from '../errors/NotFoundError.js';

const projetoIDParam = z.coerce
  .number({ error: 'O ID de projeto deve ser um número' })
  .positive({ error: 'O ID de projeto deve ser positivo' });

const categoriaIDParam = z.coerce
  .number({ error: 'O ID de categoria deve ser um número' })
  .positive({ error: 'O ID de categoria deve ser positivo' });

const categoriaSchema = z.object({
  titulo: z
    .string({ error: 'Deve ser uma String' })
    .min(1, { error: 'Mínimo 1 caractere' })
    .max(100, { error: 'Máximo 100 caracteres' }),
});

export async function criarCategoria(requestBody, projetoId, usuario) {
  const { titulo } = categoriaSchema.parse(requestBody);
  const projeto_id = projetoIDParam.parse(projetoId);
  const usuario_id = usuario.id;

  const resultadoBanco = await categoriaModel.criar({ titulo }, projeto_id, usuario_id);

  if (resultadoBanco.affectedRows === 0) {
    throw new NotFoundError('Projeto não encontrado');
  }

  const categoriaId = resultadoBanco.insertId;

  return categoriaId;
}

export async function excluirCategoria(categoriaId, projetoId, usuario) {
  const categoria_id = categoriaIDParam.parse(categoriaId);
  const projeto_id = projetoIDParam.parse(projetoId);
  const usuario_id = usuario.id;

  const resultadoBanco = await categoriaModel.excluir(categoria_id, projeto_id, usuario_id);

  if (resultadoBanco.affectedRows === 0) {
    throw new NotFoundError('Projeto ou categoria não encontrada');
  }
}
