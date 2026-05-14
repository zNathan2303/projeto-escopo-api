import z from 'zod';
import * as linkModel from '../models/link.model.js';
import * as zodParam from '../utils/zod-param.js';
import { transformarUndefinedOuStringVaziaEmNull } from '../utils/formatacoes.js';
import ApiError from '../errors/ApiError.js';

const urlCampo = z
  .string({ error: 'Deve ser uma String' })
  .min(1, { error: 'Mínimo 1 caractere' })
  .max(500, { error: 'Máximo 500 caracteres' });

const nomeCampo = z.preprocess(
  transformarUndefinedOuStringVaziaEmNull,
  z.string({ error: 'Deve ser uma String' }).max(50, { error: 'Máximo 50 caracteres' }).nullable(),
);

const criarLinkSchema = z.object({
  url: urlCampo,
  tipo_link_id: z
    .number({ error: 'Deve ser um número' })
    .positive({ error: 'Deve ser um número positivo' }),
  nome: nomeCampo,
});

const atualizarLinkSchema = z.object({
  url: urlCampo,
  nome: nomeCampo,
});

export async function criarLink({ requestBody, reuniaoIdParam }) {
  const reuniaoId = zodParam.reuniaoId.parse(reuniaoIdParam);
  const { nome, tipo_link_id, url } = criarLinkSchema.parse(requestBody);

  const resultadoBanco = await linkModel.criar({ nome, reuniaoId, tipoLinkId: tipo_link_id, url });

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Não foi possível criar o link para a reunião');
  }
}

export async function atualizarLink({ requestBody, linkIdParam }) {
  const linkId = zodParam.linkId.parse(linkIdParam);
  const { nome, url } = atualizarLinkSchema.parse(requestBody);

  const resultadoBanco = await linkModel.atualizarCampos({ linkId, nome, url });

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Não foi possível atualizar o link');
  }
}
