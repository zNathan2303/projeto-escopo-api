import z from 'zod';
import * as categoriaModel from '../models/categoria.model.js';
import * as documentoModel from '../models/documento.model.js';
import * as documentoVersaoModel from '../models/documento-versao.model.js';
import NotFoundError from '../errors/NotFoundError.js';
import * as zodParam from '../utils/zod-param.js';
import ApiError from '../errors/ApiError.js';

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

export async function criarDocumento({ requestBody, categoriaIdParam }) {
  const { titulo } = documentoSchema.parse(requestBody);
  const categoriaId = zodParam.categoriaId.parse(categoriaIdParam);

  const resultadoBanco = await documentoModel.criar({ categoriaId, titulo });

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('O documento não foi criado');
  }

  const { insertId } = resultadoBanco;

  return insertId;
}

export async function obterDetalhesDeDocumento(documentoIdParam) {
  const documentoId = zodParam.documentoId.parse(documentoIdParam);

  const documento = await documentoModel.obterDetalhesPorId(documentoId);

  if (!documento) {
    throw new NotFoundError('Não foi encontrado o documento com o ID informado');
  }

  return documento;
}

export async function desativarDocumento(documentoIdParam) {
  const documentoId = zodParam.documentoId.parse(documentoIdParam);

  const resultadoBanco = await documentoModel.desativar(documentoId);

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Documento não foi excluído');
  }
}

export async function atualizarTituloDeDocumento({ requestBody, documentoIdParam }) {
  const documentoId = zodParam.documentoId.parse(documentoIdParam);
  const { titulo } = documentoSchema.parse(requestBody);

  const resultadoBanco = await documentoModel.atualizarTitulo({
    documentoId,
    titulo,
  });

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Título do documento não foi atualizado');
  }
}

export async function criarNovaVersao({ requestBody, documentoIdParam, usuarioId }) {
  const documentoId = zodParam.documentoId.parse(documentoIdParam);
  const { conteudo } = documentoVersaoSchema.parse(requestBody);

  const resultadoBanco = await documentoVersaoModel.criar({
    conteudo,
    criadorId: usuarioId,
    documentoId,
  });

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Não foi possível criar uma nova versão do conteúdo');
  }

  const { insertId } = resultadoBanco;

  return { id: insertId };
}

export async function obterHistoricoDeVersoes(documentoIdParam) {
  const documentoId = zodParam.documentoId.parse(documentoIdParam);

  const historico = await documentoVersaoModel.obterVersoesPorDocumentoId(documentoId);

  if (historico.length === 0) {
    throw new NotFoundError('Não foi encontrado versões do respectivo documento');
  }

  return historico;
}

export async function obterVersaoPorId(versaoIdParam) {
  const versaoId = zodParam.documentoVersaoId.parse(versaoIdParam);

  const versaoDoDocumento = await documentoVersaoModel.obterPorId(versaoId);

  if (!versaoDoDocumento) {
    throw new NotFoundError('Versão do documento não encontrada');
  }

  return versaoDoDocumento;
}
