import z from 'zod';
import * as categoriaModel from '../models/categoria.model.js';
import * as documentoModel from '../models/documento.model.js';
import NotFoundError from '../errors/NotFoundError.js';

const projetoIDParam = z.coerce
  .number({ error: 'O ID de projeto deve ser um número' })
  .positive({ error: 'O ID de projeto deve ser positivo' });

export async function obterDocumentosDeCadaCategoria(projetoId, usuario) {
  const projeto_id = projetoIDParam.parse(projetoId);
  const usuario_id = usuario.id;

  const projetoComCategoriasEDocumentos = await categoriaModel.obterComDocumentos(
    projeto_id,
    usuario_id,
  );

  if (!projetoComCategoriasEDocumentos) {
    throw new NotFoundError('Projeto com o ID informado não encontrado');
  }

  return projetoComCategoriasEDocumentos;
}
