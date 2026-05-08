import z from 'zod';
import * as registroModel from '../models/registro.model.js';
import { transformarUndefinedOuStringVaziaEmNull } from '../utils/formatacoes.js';
import NotFoundError from '../errors/NotFoundError.js';
import * as zodParam from '../utils/zod-param.js';

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

export async function obterRegistrosDeUmProjeto(projetoId, usuario) {
  const id = zodParam.projetoId.parse(projetoId);
  const usuarioId = usuario.id;

  const registros = await registroModel.obterTodosDeUmProjeto(id, usuarioId);

  return registros;
}

export async function criarRegistro(requestBody, projetoIdParam, usuario) {
  const { conteudo, titulo } = registroSchema.parse(requestBody);
  const projetoId = zodParam.projetoId.parse(projetoIdParam);
  const criadorId = usuario.id;

  const resultadoBanco = await registroModel.criar({
    titulo,
    conteudo,
    projetoId,
    criadorId,
  });

  if (resultadoBanco.affectedRows === 0) {
    throw new NotFoundError('Projeto não encontrado');
  }

  const registroId = resultadoBanco.insertId;

  return { id: registroId };
}

export async function atualizarTituloDeRegistro(
  requestBody,
  projetoIdParam,
  registroIdParam,
  usuario,
) {
  const { titulo } = atualizarTituloSchema.parse(requestBody);
  const projetoId = zodParam.projetoId.parse(projetoIdParam);
  const registroId = zodParam.registroId.parse(registroIdParam);
  const usuarioId = usuario.id;

  const resultadoBanco = await registroModel.atualizarTitulo({
    projetoId,
    registroId,
    titulo,
    usuarioId,
  });

  if (resultadoBanco.affectedRows === 0) {
    throw new NotFoundError('Projeto ou registro não encontrado');
  }

  return resultadoBanco;
}

export async function atualizarConteudoDeRegistro(
  requestBody,
  projetoIdParam,
  registroIdParam,
  usuario,
) {
  const { conteudo } = atualizarConteudoSchema.parse(requestBody);
  const projetoId = zodParam.projetoId.parse(projetoIdParam);
  const registroId = zodParam.registroId.parse(registroIdParam);
  const usuarioId = usuario.id;

  const resultadoBanco = await registroModel.atualizarTitulo({
    projetoId,
    registroId,
    conteudo,
    usuarioId,
  });

  if (resultadoBanco.affectedRows === 0) {
    throw new NotFoundError('Projeto ou registro não encontrado');
  }

  return resultadoBanco;
}

export async function obterDetalhesDeUmRegistro(projetoIdParam, registroIdParam, usuario) {
  const projetoId = zodParam.projetoId.parse(projetoIdParam);
  const registroId = zodParam.registroId.parse(registroIdParam);
  const usuarioId = usuario.id;

  const resultadoBanco = await registroModel.obterDetalhesDeUm({
    projetoId,
    registroId,
    usuarioId,
  });

  if (resultadoBanco.length === 0) {
    throw new NotFoundError('Projeto ou registro não encontrado');
  }

  const [registro] = resultadoBanco;

  return registro;
}

export async function excluirRegistro(projetoIdParam, registroIdParam, usuario) {
  const projetoId = zodParam.projetoId.parse(projetoIdParam);
  const registroId = zodParam.registroId.parse(registroIdParam);
  const usuarioId = usuario.id;

  const resultadoBanco = await registroModel.excluir({ projetoId, registroId, usuarioId });

  if (resultadoBanco.affectedRows === 0) {
    throw new NotFoundError('Projeto ou registro não encontrado');
  }
}
