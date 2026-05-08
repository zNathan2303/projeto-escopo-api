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

export async function criarProjeto(requestBody, usuario) {
  const projeto = projetoSchema.parse(requestBody);

  const niveisAcessoIDs = await obterIDsDeNiveisAcesso(knex);

  await knex.transaction(async (trx) => {
    const resultadoBanco = await projetoModel.criar(
      {
        titulo: projeto.titulo,
        descricao: projeto.descricao,
        criadorId: usuario.id,
      },
      trx,
    );

    const projetoId = resultadoBanco.insertId;

    if (projeto.integrantes === undefined || projeto.integrantes.length === 0) {
      return;
    }

    const integrantes = projeto.integrantes.filter((integrante) => integrante.id !== usuario.id);

    if (integrantes.length === 0) {
      return;
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
        remetente_id: usuario.id,
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
  });
}

export async function obterProjetosQueUsuarioParticipa(usuario) {
  const projetos = await projetoModel.obterTodosQueUsuarioParticipa(usuario.id);

  return projetos;
}

export async function obterDetalhesDeUmProjeto(projetoId, usuario) {
  const id = zodParam.projetoId.parse(projetoId);

  const projeto = await projetoModel.obterDetalhes(id, usuario.id);

  if (!projeto) {
    throw new NotFoundError('Projeto não encontrado');
  }

  return projeto;
}

export async function atualizarProjeto(requestBody, projetoId, usuario) {
  const id = zodParam.projetoId.parse(projetoId);
  const projeto = projetoSchema.parse(requestBody);

  const { descricao, titulo, integrantes } = projeto;

  return await knex.transaction(async (trx) => {
    const resultadoBanco = await projetoModel.atualizar({ descricao, titulo, id }, usuario.id, trx);

    // Usuário não modificou nada, então não foi encontrado um projeto que ele possua acesso para modificar
    if (resultadoBanco.affectedRows === 0) {
      throw new NotFoundError('Não possui permissão para acessar esse recurso');
    }

    const convitesAEnviar = [];

    for (const integrante of integrantes) {
      const convite = {
        destinatarioId: integrante.id,
        nivelAcessoId: integrante.nivel_acesso_id,
        projetoId: id,
        remetenteId: usuario.id,
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

    return { id, descricao, titulo };
  });
}

export async function excluirProjeto(projetoId, usuario) {
  const id = zodParam.projetoId.parse(projetoId);

  const resultadoBanco = await projetoModel.excluir(id, usuario.id);

  if (resultadoBanco.affectedRows === 0) {
    throw new NotFoundError('Projeto não encontrado');
  }
}

export async function obterParticipantesDeUmProjeto(projetoIdParam) {
  const projetoId = zodParam.projetoId.parse(projetoIdParam);

  const participantes = await usuarioModel.obterTodosPorProjetoId(projetoId);

  return participantes;
}
