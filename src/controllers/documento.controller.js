import z from 'zod';
import * as categoriaModel from '../models/categoria.model.js';
import * as documentoModel from '../models/documento.model.js';
import NotFoundError from '../errors/NotFoundError.js';
import { validarPermissao } from '../utils/validacoes.js';
import * as zodParam from '../utils/zod-param.js';
import ForbiddenError from '../errors/ForbiddenError.js';

const documentoSchema = z.object({
  titulo: z
    .string({ error: 'Deve ser uma String' })
    .trim()
    .min(1, { error: 'Mínimo 1 caractere' })
    .max(150, { error: 'Máximo 150 caracteres' }),
});

export async function obterDocumentosDeCadaCategoria(projetoId, usuario) {
  const projeto_id = zodParam.projetoID.parse(projetoId);
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

export async function criarDocumento(requestBody, projetoIDParam, categoriaIDParam, usuarioID) {
  const { titulo } = documentoSchema.parse(requestBody);
  const projetoID = zodParam.projetoID.parse(projetoIDParam);
  const categoriaID = zodParam.categoriaID.parse(categoriaIDParam);

  const temPermissao = await validarPermissao({ projetoID, usuarioID, niveisDeAcessoIDs: [1, 2] });

  if (!temPermissao) {
    throw new ForbiddenError('Não possui permissão para acessar esse recurso');
  }

  const resultadoBanco = await documentoModel.criar({ categoriaID, titulo });

  if (resultadoBanco.affectedRows === 0) {
    throw new NotFoundError('Não foi encontrada a categoria com o ID informado');
  }

  const { insertId } = resultadoBanco;

  return insertId;
}
