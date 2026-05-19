import z from 'zod';
import * as projetoModel from '../models/projeto.model.js';
import * as conviteModel from '../models/convite.model.js';
import * as usuarioModel from '../models/usuario.model.js';
import knex from '../config/database.js';
import { transformarUndefinedOuStringVaziaEmNull } from '../utils/formatacoes.js';
import BadRequestError from '../errors/BadRequestError.js';
import NotFoundError from '../errors/NotFoundError.js';
import ForbiddenError from '../errors/ForbiddenError.js';
import { obterIDsDeNiveisAcesso } from '../cache/nivel-acesso.cache.js';
import * as zodParam from '../utils/zod-param.js';
import ApiError from '../errors/ApiError.js';

const projetoSchema = z.object({
  titulo: z
    .string({ error: 'Deve ser uma String' })
    .trim()
    .min(1, { error: 'Mínimo 1 caractere' })
    .max(100, { error: 'Máximo 100 caracteres' }),
  descricao: z.preprocess(
    transformarUndefinedOuStringVaziaEmNull,
    z.string({ error: 'Deve ser uma String' }).nullable(),
  ),
  integrantes: z
    .array(
      z.object({
        id: z
          .number({ error: 'O ID de um integrante deve ser um número' })
          .positive({ error: 'O ID de um integrante deve ser positivo' }),
        nivel_acesso_id: z
          .number({ error: 'O ID de nível de acesso de um integrante deve ser um número' })
          .positive({ error: 'O ID nível de acesso de um integrante deve ser positivo' }),
      }),
      { error: 'Integrantes deve ser um array' },
    )
    .optional(),
});

export async function criarProjeto({ requestBody, usuarioId }) {
  const projeto = projetoSchema.parse(requestBody);

  const niveisAcessoIDs = await obterIDsDeNiveisAcesso(knex);

  return await knex.transaction(async (trx) => {
    const resultadoBanco = await projetoModel.criar(
      {
        titulo: projeto.titulo,
        descricao: projeto.descricao,
        criadorId: usuarioId,
      },
      trx,
    );

    if (resultadoBanco.affectedRows === 0) {
      throw new ApiError('Não foi possível criar o projeto');
    }

    const projetoId = resultadoBanco.insertId;

    if (projeto.integrantes === undefined || projeto.integrantes.length === 0) {
      return { id: projetoId };
    }

    const integrantes = projeto.integrantes.filter((integrante) => integrante.id !== usuarioId);

    if (integrantes.length === 0) {
      return { id: projetoId };
    }

    const algumIntegranteInvalido = projeto.integrantes.some(
      (integrante) => !niveisAcessoIDs.includes(integrante.nivel_acesso_id),
    );

    if (algumIntegranteInvalido) {
      throw new BadRequestError('Algum ID de nível de acesso enviado é inválido');
    }

    const convites = integrantes.map((integrante) => {
      return {
        projeto_id: projetoId,
        destinatario_id: integrante.id,
        nivel_acesso_id: integrante.nivel_acesso_id,
        remetente_id: usuarioId,
      };
    });

    try {
      await conviteModel.criarVarios(convites, trx);
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new BadRequestError('Algum ID de integrante enviado é inválido');
      }

      throw error;
    }

    return { id: projetoId };
  });
}

export async function obterProjetosQueUsuarioParticipa(usuarioId) {
  const projetos = await projetoModel.obterTodosQueUsuarioParticipa(usuarioId);

  return projetos;
}

export async function obterDetalhesDeUmProjeto({ projetoIdParam, usuarioId }) {
  const projetoId = zodParam.projetoId.parse(projetoIdParam);

  const projeto = await projetoModel.obterDetalhes({ projetoId, usuarioId });

  if (!projeto) {
    throw new NotFoundError('Projeto com o ID informado não encontrado');
  }

  return projeto;
}

export async function atualizarProjeto({ requestBody, projetoIdParam, usuarioId }) {
  const projetoId = zodParam.projetoId.parse(projetoIdParam);
  const projeto = projetoSchema.parse(requestBody);

  const { descricao, titulo, integrantes } = projeto;

  return await knex.transaction(async (trx) => {
    const resultadoBanco = await projetoModel.atualizar({ descricao, titulo, projetoId }, trx);

    if (resultadoBanco.affectedRows === 0) {
      throw new ApiError('Não foi possível atualizar o projeto');
    }

    const convitesAEnviar = [];

    for (const integrante of integrantes) {
      const convite = {
        destinatarioId: integrante.id,
        nivelAcessoId: integrante.nivel_acesso_id,
        projetoId: projetoId,
        remetenteId: usuarioId,
      };

      convitesAEnviar.push(conviteModel.enviarDinamicamentePorProcedure(convite, trx));
    }

    try {
      await Promise.all(convitesAEnviar);
    } catch (error) {
      if (error.code === 45000) {
        throw new NotFoundError(
          'Um ou mais dos campos inseridos para o integrante não foram encontrados',
        );
      }

      if (error.code === 45001) {
        throw new ForbiddenError('Não possui permissão para acessar esse recurso');
      }

      throw error;
    }

    return { projetoId, descricao, titulo };
  });
}

export async function desativarProjeto(projetoIdParam) {
  const projetoId = zodParam.projetoId.parse(projetoIdParam);

  const resultadoBanco = await projetoModel.desativar(projetoId);

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Não foi possível excluir o projeto');
  }
}

export async function obterParticipantesDeUmProjeto(projetoIdParam) {
  const projetoId = zodParam.projetoId.parse(projetoIdParam);

  const participantes = await usuarioModel.obterTodosPorProjetoId(projetoId);

  return participantes;
}
