import z from 'zod';
import * as registroModel from '../models/registro.model.js';
import { transformarUndefinedOuStringVaziaEmNull } from '../utils/formatacoes.js';
import NotFoundError from '../errors/NotFoundError.js';
import * as zodParam from '../utils/zod-param.js';
import ApiError from '../errors/ApiError.js';

const tituloField = z
  .string({ error: 'Deve ser uma String' })
  .trim()
  .min(1, { error: 'Mínimo 1 caractere' })
  .max(150, { error: 'Máximo 150 caracteres' });

const conteudoField = z.preprocess(
  transformarUndefinedOuStringVaziaEmNull,
  z.string({ error: 'Deve ser uma String' }).nullable(),
);

const registroSchema = z.object({
  titulo: tituloField,
  conteudo: conteudoField,
});

const atualizarTituloSchema = z.object({
  titulo: tituloField,
});

const atualizarConteudoSchema = z.object({
  conteudo: conteudoField,
});

export async function obterRegistrosPorProjetoId(projetoIdParam) {
  const projetoId = zodParam.projetoId.parse(projetoIdParam);

  const registros = await registroModel.obterTodosPorProjetoId(projetoId);

  return registros;
}

export async function criarRegistro({ requestBody, projetoIdParam, usuarioId }) {
  const { conteudo, titulo } = registroSchema.parse(requestBody);
  const projetoId = zodParam.projetoId.parse(projetoIdParam);

  const resultadoBanco = await registroModel.criar({
    titulo,
    conteudo,
    projetoId,
    criadorId: usuarioId,
  });

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Não foi possível criar o projeto');
  }

  return { id: resultadoBanco.insertId };
}

export async function atualizarTituloDeRegistro({ requestBody, registroIdParam }) {
  const { titulo } = atualizarTituloSchema.parse(requestBody);
  const registroId = zodParam.registroId.parse(registroIdParam);

  const resultadoBanco = await registroModel.atualizarTitulo({
    registroId,
    titulo,
  });

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Não foi possível atualizar o título do registro');
  }
}

export async function atualizarConteudoDeRegistro({ requestBody, registroIdParam }) {
  const { conteudo } = atualizarConteudoSchema.parse(requestBody);
  const registroId = zodParam.registroId.parse(registroIdParam);

  const resultadoBanco = await registroModel.atualizarConteudo({
    registroId,
    conteudo,
  });

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Não foi possível atualizar o conteúdo do registro');
  }
}

export async function obterDetalhesDeUmRegistro(registroIdParam) {
  const registroId = zodParam.registroId.parse(registroIdParam);

  const resultadoBanco = await registroModel.obterDetalhesPorRegistroId(registroId);

  if (resultadoBanco.length === 0) {
    throw new NotFoundError('Não foi encontrado o registro com o ID informado');
  }

  const [registro] = resultadoBanco;

  return registro;
}

export async function excluirRegistro(registroIdParam) {
  const registroId = zodParam.registroId.parse(registroIdParam);

  const resultadoBanco = await registroModel.excluir(registroId);

  if (resultadoBanco.affectedRows === 0) {
    throw new NotFoundError('Projeto ou registro não encontrado');
  }
}
