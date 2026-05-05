import z from 'zod';
import * as registroModel from '../models/registro.model.js';
import { transformarUndefinedOuStringVaziaEmNull } from '../utils/formatacoes.js';
import ForbiddenError from '../errors/ForbiddenError.js';
import NotFoundError from '../errors/NotFoundError.js';

const tituloField = z
  .string({ error: 'Deve ser uma String' })
  .trim()
  .min(1, { error: 'Mínimo 1 caractere' })
  .max(150, { error: 'Máximo 150 caracteres' });

const conteudoField = z.preprocess(
  transformarUndefinedOuStringVaziaEmNull,
  z.string({ error: 'Deve ser uma String' }).nullable(),
);

const projetoIdParam = z.coerce
  .number({ error: 'O ID de projeto deve ser um número' })
  .positive({ error: 'O ID de projeto deve ser positivo' });

const registroIdParam = z.coerce
  .number({ error: 'O ID de registro deve ser um número' })
  .positive({ error: 'O ID de registro deve ser positivo' });

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
  const id = projetoIdParam.parse(projetoId);
  const usuarioId = usuario.id;

  const registros = await registroModel.obterTodosDeUmProjeto(id, usuarioId);

  return registros;
}

export async function criarRegistro(requestBody, projetoId, usuario) {
  const { conteudo, titulo } = registroSchema.parse(requestBody);
  const projeto_id = projetoIdParam.parse(projetoId);
  const criador_id = usuario.id;

  const resultadoBanco = await registroModel.criar({
    titulo,
    conteudo,
    projeto_id,
    criador_id,
  });

  if (resultadoBanco.affectedRows === 0) {
    throw new ForbiddenError('Não possui permissão para acessar esse recurso');
  }

  const registroId = resultadoBanco.insertId;

  return registroId;
}

export async function atualizarTituloDeRegistro(requestBody, projetoId, registroId, usuario) {
  const { titulo } = atualizarTituloSchema.parse(requestBody);
  const projeto_id = projetoIdParam.parse(projetoId);
  const registro_id = registroIdParam.parse(registroId);
  const usuario_id = usuario.id;

  const resultadoBanco = await registroModel.atualizarTitulo({
    projeto_id,
    registro_id,
    titulo,
    usuario_id,
  });

  if (resultadoBanco.affectedRows === 0) {
    throw new ForbiddenError('Não possui permissão para acessar esse recurso');
  }

  return resultadoBanco;
}

export async function atualizarConteudoDeRegistro(requestBody, projetoId, registroId, usuario) {
  const { conteudo } = atualizarConteudoSchema.parse(requestBody);
  const projeto_id = projetoIdParam.parse(projetoId);
  const registro_id = registroIdParam.parse(registroId);
  const usuario_id = usuario.id;

  const resultadoBanco = await registroModel.atualizarTitulo({
    projeto_id,
    registro_id,
    conteudo,
    usuario_id,
  });

  if (resultadoBanco.affectedRows === 0) {
    throw new ForbiddenError('Não possui permissão para acessar esse recurso');
  }

  return resultadoBanco;
}

export async function obterDetalhesDeUmRegistro(projetoId, registroId, usuario) {
  const projeto_id = projetoIdParam.parse(projetoId);
  const registro_id = registroIdParam.parse(registroId);
  const usuario_id = usuario.id;

  const resultadoBanco = await registroModel.obterDetalhesDeUm(registro_id, projeto_id, usuario_id);

  if (resultadoBanco.length === 0) {
    throw new NotFoundError('Projeto ou registro não encontrado');
  }

  const [registro] = resultadoBanco;

  return registro;
}

export async function excluirRegistro(projetoId, registroId, usuario) {
  const projeto_id = projetoIdParam.parse(projetoId);
  const registro_id = registroIdParam.parse(registroId);
  const usuario_id = usuario.id;

  const resultadoBanco = await registroModel.excluir(registro_id, projeto_id, usuario_id);

  if (resultadoBanco.affectedRows === 0) {
    throw new ForbiddenError('Não possui permissão para acessar esse recurso');
  }
}
