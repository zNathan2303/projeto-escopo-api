import z from 'zod';
import * as projetoModel from '../models/projeto.model.js';
import * as conviteModel from '../models/convite.model.js';
import knex from '../config/database.js';
import { transformarUndefinedOuStringVaziaEmNull } from '../utils/formatacoes.js';

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
    )
    .optional(),
});

export async function criarProjeto(requestBody, usuario) {
  const projeto = projetoSchema.parse(requestBody);

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

    const convites = projeto.integrantes.map((integrante) => {
      return {
        projeto_id: projetoId,
        destinatario_id: integrante.id,
        nivel_acesso_id: integrante.nivel_acesso_id,
        remetente_id: usuario.id,
      };
    });

    await conviteModel.criarVarios(convites, trx);
  });
}
