import z from 'zod';
import * as categoriaModel from '../models/categoria.model.js';
import * as zodParam from '../utils/zod-param.js';
import ApiError from '../errors/ApiError.js';

const criarCategoriaSchema = z.object({
  titulo: z
    .string({ error: 'Deve ser uma String' })
    .min(1, { error: 'Mínimo 1 caractere' })
    .max(100, { error: 'Máximo 100 caracteres' }),
});

export async function criarCategoria({ requestBody, projetoIdParam }) {
  const { titulo } = criarCategoriaSchema.parse(requestBody);
  const projetoId = zodParam.projetoId.parse(projetoIdParam);

  const resultadoBanco = await categoriaModel.criar({ titulo, projetoId });

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Projeto não criado');
  }
}

export async function desativarCategoria(categoriaIdParam) {
  const categoriaId = zodParam.categoriaId.parse(categoriaIdParam);

  const resultadoBanco = await categoriaModel.desativar(categoriaId);

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Categoria não foi excluída');
  }
}
