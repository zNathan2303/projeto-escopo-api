import z from 'zod';
import * as categoriaModel from '../models/categoria.model.js';
import * as documentoModel from '../models/documento.model.js';
import NotFoundError from '../errors/NotFoundError.js';
import { validarPermissao } from '../utils/validacoes.js';
import * as zodParam from '../utils/zod-param.js';
import ForbiddenError from '../errors/ForbiddenError.js';

const criarDocumentoSchema = z.object({
  titulo: z
    .string({ error: 'Deve ser uma String' })
    .trim()
    .min(1, { error: 'Mínimo 1 caractere' })
    .max(150, { error: 'Máximo 150 caracteres' }),
});

export async function obterDocumentosDeCadaCategoria(projetoIdParam, usuarioId) {
  const projetoId = zodParam.projetoId.parse(projetoIdParam);

  const projetoComCategoriasEDocumentos = await categoriaModel.obterComDocumentos(
    projetoId,
    usuarioId,
  );

  if (!projetoComCategoriasEDocumentos) {
    throw new NotFoundError('Projeto com o ID informado não encontrado');
  }

  return projetoComCategoriasEDocumentos;
}

export async function criarDocumento(requestBody, projetoIdParam, categoriaIdParam, usuarioId) {
  const { titulo } = criarDocumentoSchema.parse(requestBody);
  const projetoId = zodParam.projetoId.parse(projetoIdParam);
  const categoriaId = zodParam.categoriaId.parse(categoriaIdParam);

  const temPermissao = await validarPermissao({ projetoId, usuarioId, niveisDeAcessoIds: [1, 2] });

  if (!temPermissao) {
    throw new ForbiddenError('Não possui permissão para acessar esse recurso');
  }

  const resultadoBanco = await documentoModel.criar({ categoriaId, titulo, projetoId });

  if (resultadoBanco.affectedRows === 0) {
    throw new NotFoundError('Não foi encontrada a categoria pertencente ao projeto');
  }

  const { insertId } = resultadoBanco;

  return insertId;
}

export async function obterDetalhesDeDocumento(documentoIdParam, categoriaIdParam, projetoIdParam) {
  const projetoId = zodParam.projetoId.parse(projetoIdParam);
  const categoriaId = zodParam.categoriaId.parse(categoriaIdParam);
  const documentoId = zodParam.documentoId.parse(documentoIdParam);

  const documento = await documentoModel.obterDetalhesPorId({
    categoriaId,
    documentoId,
    projetoId,
  });

  if (!documento) {
    throw new NotFoundError('Documento não encontrado');
  }

  return documento;
}
