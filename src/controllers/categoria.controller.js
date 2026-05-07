import z from 'zod';
import * as categoriaModel from '../models/categoria.model.js';
import NotFoundError from '../errors/NotFoundError.js';
import * as zodParam from '../utils/zod-param.js';

const criarCategoriaSchema = z.object({
  titulo: z
    .string({ error: 'Deve ser uma String' })
    .min(1, { error: 'Mínimo 1 caractere' })
    .max(100, { error: 'Máximo 100 caracteres' }),
});

export async function criarCategoria(requestBody, projetoIdParam, usuarioId) {
  const { titulo } = criarCategoriaSchema.parse(requestBody);
  const projetoId = zodParam.projetoId.parse(projetoIdParam);

  const resultadoBanco = await categoriaModel.criar({ titulo, projetoId, usuarioId });

  if (resultadoBanco.affectedRows === 0) {
    throw new NotFoundError('Projeto não encontrado');
  }

  const categoriaId = resultadoBanco.insertId;

  return categoriaId;
}

export async function excluirCategoria(categoriaIdParam, projetoIdParam, usuarioId) {
  const categoriaId = zodParam.categoriaId.parse(categoriaIdParam);
  const projetoId = zodParam.projetoId.parse(projetoIdParam);

  const resultadoBanco = await categoriaModel.excluir(categoriaId, projetoId, usuarioId);

  if (resultadoBanco.affectedRows === 0) {
    throw new NotFoundError('Projeto ou categoria não encontrada');
  }
}
