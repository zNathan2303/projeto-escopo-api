import z from 'zod';
import * as projetoModel from '../models/projeto.model.js';
import * as conviteModel from '../models/convite.model.js';
import * as usuarioModel from '../models/usuario.model.js';
import * as usuarioProjetoModel from '../models/usuario-projeto.model.js';
import knex from '../config/database.js';
import { transformarUndefinedOuStringVaziaEmNull } from '../utils/formatacoes.js';
import BadRequestError from '../errors/BadRequestError.js';
import NotFoundError from '../errors/NotFoundError.js';
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

const projetoUpdateSchema = z.object({
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
    .object({
      atuais: z
        .array(
          z.object({
            usuario_projeto_id: z
              .number({ error: 'O usuario_projeto_id deve ser um número' })
              .positive({ error: 'O usuario_projeto_id deve ser positivo' }),
            nivel_acesso_id: z
              .number({ error: 'O ID de nível de acesso deve ser um número' })
              .positive({ error: 'O ID de nível de acesso deve ser positivo' }),
          }),
          { error: 'Integrantes atuais deve ser um array' },
        )
        .optional(),
      excluidos: z
        .array(
          z.object({
            usuario_projeto_id: z
              .number({ error: 'O usuario_projeto_id deve ser um número' })
              .positive({ error: 'O usuario_projeto_id deve ser positivo' }),
          }),
          { error: 'Integrantes excluídos deve ser um array' },
        )
        .optional(),
    })
    .optional(),
  convites: z
    .object({
      adicionais: z
        .array(
          z.object({
            usuario_id: z
              .number({ error: 'O usuario_id deve ser um número' })
              .positive({ error: 'O usuario_id deve ser positivo' }),
            nivel_acesso_id: z
              .number({ error: 'O ID de nível de acesso deve ser um número' })
              .positive({ error: 'O ID de nível de acesso deve ser positivo' }),
          }),
          { error: 'Convites adicionais deve ser um array' },
        )
        .optional(),
      pendentes: z
        .array(
          z.object({
            convite_id: z
              .number({ error: 'O convite_id deve ser um número' })
              .positive({ error: 'O convite_id deve ser positivo' }),
            nivel_acesso_id: z
              .number({ error: 'O ID de nível de acesso deve ser um número' })
              .positive({ error: 'O ID de nível de acesso deve ser positivo' }),
          }),
          { error: 'Convites pendentes deve ser um array' },
        )
        .optional(),
      excluidos: z
        .array(
          z.object({
            convite_id: z
              .number({ error: 'O convite_id deve ser um número' })
              .positive({ error: 'O convite_id deve ser positivo' }),
          }),
          { error: 'Convites excluídos deve ser um array' },
        )
        .optional(),
    })
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
  const projeto = projetoUpdateSchema.parse(requestBody);

  const { descricao, titulo, integrantes, convites } = projeto;

  const niveisAcessoIDs = await obterIDsDeNiveisAcesso(knex);

  return await knex.transaction(async (trx) => {
    const resultadoBanco = await projetoModel.atualizar({ descricao, titulo, projetoId }, trx);

    if (resultadoBanco.affectedRows === 0) {
      throw new ApiError('Não foi possível atualizar o projeto');
    }

    const operacoesDeIntegrantesEConvites = [];

    if (integrantes) {
      if (integrantes.atuais) {
        const algumIntegranteInvalido = integrantes.atuais.some(
          (integrante) => !niveisAcessoIDs.includes(integrante.nivel_acesso_id),
        );

        if (algumIntegranteInvalido) {
          throw new BadRequestError(
            'Algum ID de nível de acesso de um integrante atual é inválido',
          );
        }

        for (const integranteAtual of integrantes.atuais) {
          operacoesDeIntegrantesEConvites.push(
            usuarioProjetoModel.atualizarNivelDeAcessoPorUsuarioProjetoId(
              {
                nivelAcessoId: integranteAtual.nivel_acesso_id,
                usuarioProjetoId: integranteAtual.usuario_projeto_id,
                projetoId,
              },
              trx,
            ),
          );
        }
      }

      if (integrantes.excluidos) {
        for (const integranteExcluido of integrantes.excluidos) {
          operacoesDeIntegrantesEConvites.push(
            usuarioProjetoModel.excluirUsuarioProjeto(
              { usuarioProjetoId: integranteExcluido.usuario_projeto_id, projetoId },
              trx,
            ),
          );
        }
      }
    }

    if (convites) {
      if (convites.adicionais) {
        const algumConviteInvalido = convites.adicionais.some(
          (convite) => !niveisAcessoIDs.includes(convite.nivel_acesso_id),
        );

        if (algumConviteInvalido) {
          throw new BadRequestError(
            'Algum ID de nível de acesso de um convite adicional é inválido',
          );
        }

        const convitesFormatados = convites.adicionais.map((convite) => {
          return {
            projeto_id: projetoId,
            destinatario_id: convite.usuario_id,
            nivel_acesso_id: convite.nivel_acesso_id,
            remetente_id: usuarioId,
          };
        });

        await conviteModel.criarVarios(convitesFormatados, trx);
      }

      if (convites.excluidos) {
        const conviteIdExcluidos = convites.excluidos.map((convite) => convite.convite_id);

        const quantidadeConvitesExcluidos = await conviteModel.excluirVarios(
          { convitesIds: conviteIdExcluidos, projetoId },
          trx,
        );

        if (quantidadeConvitesExcluidos !== convites.excluidos.length) {
          throw new ApiError(
            `Convites que eram para ser excluídos: ${convites.excluidos.length}. Convites que foram excluídos: ${quantidadeConvitesExcluidos}. Operações desfeitas.`,
          );
        }
      }

      if (convites.pendentes) {
        const algumConviteInvalido = convites.pendentes.some(
          (convite) => !niveisAcessoIDs.includes(convite.nivel_acesso_id),
        );

        if (algumConviteInvalido) {
          throw new BadRequestError(
            'Algum ID de nível de acesso de um convite pendente é inválido',
          );
        }

        for (const convitePendente of convites.pendentes) {
          operacoesDeIntegrantesEConvites.push(
            conviteModel.atualizarNivelDeAcesso(
              {
                conviteId: convitePendente.convite_id,
                nivelAcessoId: convitePendente.nivel_acesso_id,
              },
              trx,
            ),
          );
        }
      }
    }

    try {
      const resultadosBanco = await Promise.all(operacoesDeIntegrantesEConvites);

      const existeAffectedRowsZero = resultadosBanco.some(
        (resultado) => resultado.affectedRows === 0,
      );

      if (existeAffectedRowsZero) {
        throw new BadRequestError(
          'Não foi possível realizar alguma operação. Operações realizadas desfeitas.',
        );
      }
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new BadRequestError('Algum ID de integrante enviado é inválido');
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
