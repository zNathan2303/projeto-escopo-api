import z from 'zod';
import * as projetoModel from '../models/projeto.model.js';
import * as conviteModel from '../models/convite.model.js';
import knex from '../config/database.js';
import { transformarUndefinedOuStringVaziaEmNull } from '../utils/formatacoes.js';
import BadRequestError from '../errors/BadRequestError.js';
import NotFoundError from '../errors/NotFoundError.js';
import { obterIDsDeNiveisAcesso } from '../cache/nivel-acesso.cache.js';

const projetoSchema = z.object({
  titulo: z
    .string('Deve ser uma String')
    .trim()
    .min(1, 'Mínimo 1 caractere')
    .max(100, 'Máximo 100 caracteres'),
  descricao: z.preprocess(
    transformarUndefinedOuStringVaziaEmNull,
    z.string('Deve ser uma String').nullable(),
  ),
  integrantes: z
    .array(
      z.object({
        id: z
          .number('O ID de um integrante deve ser um número')
          .positive('O ID de um integrante deve ser positivo'),
        nivel_acesso_id: z.number(
          'O ID de nível de acesso de um integrante deve ser um número',
        ),
      }),
      'Integrantes deve ser um array',
    )
    .optional(),
});

export async function criarProjeto(requestBody, usuario) {
  const projeto = projetoSchema.parse(requestBody);

  const niveisAcessoIDs = await obterIDsDeNiveisAcesso(knex);

  await knex.transaction(async (trx) => {
    const projetoId = await projetoModel.criar(
      {
        titulo: projeto.titulo,
        descricao: projeto.descricao,
        criador_id: usuario.id,
      },
      trx,
    );

    if (projeto.integrantes === undefined || projeto.integrantes.length === 0) {
      return;
    }

    const integrantes = projeto.integrantes.filter(
      (integrante) => integrante.id !== usuario.id,
    );

    if (integrantes.length === 0) {
      return;
    }

    const algumIntegranteInvalido = projeto.integrantes.some(
      (integrante) => !niveisAcessoIDs.includes(integrante.nivel_acesso_id),
    );

    if (algumIntegranteInvalido) {
      throw new BadRequestError(
        'Algum ID de nível de acesso enviado é inválido',
      );
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

export async function obterProjetosQueUsuarioEsta(usuario) {
  const projetos = await projetoModel.obterTodosQueUsuarioEsta(usuario.id);

  return projetos;
}

export async function obterDetalhesDeUmProjeto(id, usuario) {
  const projeto = await projetoModel.obterDetalhes(id, usuario.id);

  if (!projeto) {
    throw new NotFoundError('Projeto não encontrado');
  }

  return projeto;
}
