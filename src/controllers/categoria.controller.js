import z from 'zod';
import * as categoriaModel from '../models/categoria.model.js';
import NotFoundError from '../errors/NotFoundError.js';
import * as zodParam from '../utils/zod-param.js';

const categoriaSchema = z.object({
  titulo: z
    .string({ error: 'Deve ser uma String' })
    .min(1, { error: 'Mínimo 1 caractere' })
    .max(100, { error: 'Máximo 100 caracteres' }),
});

export async function criarCategoria(requestBody, projetoId, usuario) {
  const { titulo } = categoriaSchema.parse(requestBody);
  const projeto_id = zodParam.projetoId.parse(projetoId);
  const usuario_id = usuario.id;

  const resultadoBanco = await categoriaModel.criar({ titulo }, projeto_id, usuario_id);

  if (resultadoBanco.affectedRows === 0) {
    throw new NotFoundError('Projeto não encontrado');
  }

  const categoriaId = resultadoBanco.insertId;

  return categoriaId;
}

export async function excluirCategoria(categoriaId, projetoId, usuario) {
  const categoria_id = zodParam.categoriaId.parse(categoriaId);
  const projeto_id = zodParam.projetoId.parse(projetoId);
  const usuario_id = usuario.id;

  const resultadoBanco = await categoriaModel.excluir(categoria_id, projeto_id, usuario_id);

  if (resultadoBanco.affectedRows === 0) {
    throw new NotFoundError('Projeto ou categoria não encontrada');
  }
}
