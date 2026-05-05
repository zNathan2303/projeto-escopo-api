import knex from '../config/database.js';

export async function obterTodosDeUmProjeto(projetoId, usuarioId) {
  const registros = await knex('registro as r')
    .select('r.id', 'r.titulo', 'r.conteudo', 'r.atualizado_em', 'r.criado_em')
    .where('r.projeto_id', projetoId)
    .join('usuario_projeto as up', 'up.projeto_id', 'r.projeto_id')
    .where('up.usuario_id', usuarioId);

  return registros;
}

export async function criar({ titulo, conteudo, projeto_id, criador_id }) {
  const [resultado] = await knex.raw(
    `
    INSERT INTO registro (titulo, conteudo, criador_id, projeto_id)
    SELECT ?, ?, ?, ?
    WHERE EXISTS (
      SELECT 1
      FROM usuario_projeto
      WHERE projeto_id = ?
        AND usuario_id = ?
        AND nivel_acesso_id IN (?, ?)
    )
    `,
    [titulo, conteudo, criador_id, projeto_id, projeto_id, criador_id, 1, 2],
  );

  return resultado; // Contém affectedRows e insertId
}
