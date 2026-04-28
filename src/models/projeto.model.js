import knex from '../config/database.js';

export async function criar({ titulo, descricao, criador_id }, db = knex) {
  const [id] = await db('projeto').insert({
    titulo,
    descricao,
    criador_id,
  });

  return id;
}
