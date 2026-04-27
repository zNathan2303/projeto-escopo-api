import z from 'zod';
import * as conviteModel from '../models/convite.model.js';

const conviteSchema = z.object({
  projeto_id: z.number('Deve ser um número'),
  destinatario_id: z.number('Deve ser um número'),
  nivel_acesso_id: z.number('Deve ser um número'),
  remetente_id: z.number('Deve ser um número'),
});

export async function criarConvite(conviteBody) {
  const { destinatario_id, nivel_acesso_id, projeto_id, remetente_id } =
    conviteSchema.parse(conviteBody);

  const conviteId = conviteModel.criar({
    destinatario_id,
    nivel_acesso_id,
    projeto_id,
    remetente_id,
  });

  return conviteId;
}
