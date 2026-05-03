import knex from '../config/database.js';

export async function criar({ projeto_id, destinatario_id, nivel_acesso_id, remetente_id }) {
  const [id] = await knex('convite').insert({
    projeto_id,
    destinatario_id,
    nivel_acesso_id,
    remetente_id,
  });

  return id;
}

export async function criarVarios(convites, db = knex) {
  const IDs = await db('convite').insert(convites);

  return IDs;
}

export async function enviarDinamicamentePorProcedure(
  { projetoID, destinatarioID, nivelAcessoID, remetenteID },
  db = knex,
) {
  await db.raw('CALL enviar_convite(?, ?, ?, ?)', [
    projetoID,
    destinatarioID,
    nivelAcessoID,
    remetenteID,
  ]);
}
