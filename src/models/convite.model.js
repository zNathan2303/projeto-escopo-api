import knex from '../config/database.js';

export async function criar({
  projeto_id,
  destinatario_id,
  nivel_acesso_id,
  remetente_id,
}) {
  const [id] = await knex('convite').insert({
    projeto_id,
    destinatario_id,
    nivel_acesso_id,
    remetente_id,
  });

  return id;
}
