import z from 'zod';
import * as categoriaModel from '../models/categoria.model.js';
import * as documentoModel from '../models/documento.model.js';
import * as documentoVersaoModel from '../models/documento-versao.model.js';
import NotFoundError from '../errors/NotFoundError.js';
import * as zodParam from '../utils/zod-param.js';

const documentoSchema = z.object({
  titulo: z
    .string({ error: 'Deve ser uma String' })
    .trim()
    .min(1, { error: 'Mínimo 1 caractere' })
    .max(150, { error: 'Máximo 150 caracteres' }),
});

const documentoVersaoSchema = z.object({
  conteudo: z
    .string({ error: 'Deve ser uma String' })
    .trim()
    .min(1, { error: 'Mínimo 1 caractere' }),
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

export async function criarDocumento(requestBody, projetoIdParam, categoriaIdParam) {
  const { titulo } = documentoSchema.parse(requestBody);
  const projetoId = zodParam.projetoId.parse(projetoIdParam);
  const categoriaId = zodParam.categoriaId.parse(categoriaIdParam);

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

export async function desativarDocumento(documentoIdParam, categoriaIdParam, projetoIdParam) {
  const projetoId = zodParam.projetoId.parse(projetoIdParam);
  const categoriaId = zodParam.categoriaId.parse(categoriaIdParam);
  const documentoId = zodParam.documentoId.parse(documentoIdParam);

  const resultadoBanco = await documentoModel.desativar({ categoriaId, documentoId, projetoId });

  if (resultadoBanco.affectedRows === 0) {
    throw new NotFoundError('Não foi encontrado o documento pertencente ao projeto');
  }
}

export async function atualizarTituloDeDocumento(
  requestBody,
  documentoIdParam,
  categoriaIdParam,
  projetoIdParam,
) {
  const projetoId = zodParam.projetoId.parse(projetoIdParam);
  const categoriaId = zodParam.categoriaId.parse(categoriaIdParam);
  const documentoId = zodParam.documentoId.parse(documentoIdParam);
  const { titulo } = documentoSchema.parse(requestBody);

  const resultadoBanco = await documentoModel.atualizarTitulo({
    categoriaId,
    documentoId,
    projetoId,
    titulo,
  });

  if (resultadoBanco.affectedRows === 0) {
    throw new NotFoundError('Não foi encontrado o documento pertencente ao projeto');
  }
}

export async function criarNovaVersao(
  requestBody,
  documentoIdParam,
  categoriaIdParam,
  projetoIdParam,
  usuarioId,
) {
  const projetoId = zodParam.projetoId.parse(projetoIdParam);
  const categoriaId = zodParam.categoriaId.parse(categoriaIdParam);
  const documentoId = zodParam.documentoId.parse(documentoIdParam);
  const { conteudo } = documentoVersaoSchema.parse(requestBody);

  const resultadoBanco = await documentoVersaoModel.criar({
    categoriaId,
    conteudo,
    criadorId: usuarioId,
    documentoId,
    projetoId,
  });

  if (resultadoBanco.affectedRows === 0) {
    throw new NotFoundError('Não foi encontrado o documento para criar uma nova versão');
  }

  const { insertId } = resultadoBanco;

  return { id: insertId };
}
