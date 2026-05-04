import knex from '../config/database.js';

export async function obterTodosDeUmProjeto(projetoId, usuarioId) {
  const registros = await knex('registro as r')
    .select('r.id', 'r.titulo', 'r.conteudo', 'r.atualizado_em', 'r.criado_em')
    .where('r.projeto_id', projetoId)
    .join('usuario_projeto as up', 'up.projeto_id', 'r.projeto_id')
    .where('up.usuario_id', usuarioId);

  return registros;
}

export async function criar({ titulo, conteudo, projetoId, usuarioId }) {
  const resultado = await knex('registro as r').insert({
    titulo,
    conteudo,
    criador_id: usuarioId,
    projeto_id: projetoId,
  });

  const [id] = resultado;

  return id;
}
