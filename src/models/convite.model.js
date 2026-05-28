import knex from '../config/database.js';

export async function criarVarios(convites, db = knex) {
  // Utiliza o Query Builder para facilitar, devido os convites serem um Array
  const IDs = await db('convite').insert(convites);

  return IDs;
}

export async function obterAtivosDeUsuario(usuarioId) {
  const [convites] = await knex.raw(
    `
    SELECT
      convite.id,
      usuario.nome AS nome_remetente,
      projeto.titulo AS projeto,
      convite.criado_em,
      convite.projeto_id,
      convite.destinatario_id,
      COALESCE((
        SELECT JSON_OBJECT(
          'id', convite_status.id,
          'nome', convite_status.nome
        ) FROM convite_status
        WHERE convite.convite_status_id = convite_status.id
      ), JSON_OBJECT()) AS status
    FROM convite
    JOIN projeto
      ON convite.projeto_id = projeto.id
    JOIN usuario
      ON convite.remetente_id = usuario.id
    WHERE convite_status_id IN (?, ?)
      AND destinatario_id = ?
    ORDER BY criado_em DESC
    `,
    [1, 4, usuarioId],
  );

  return convites;
}

export async function atualizarConviteStatus({ conviteId, usuarioId, novoStatusId }) {
  const [resultado] = await knex.raw(
    `
    CALL atualizar_convite(?, ?, ?)
    `,
    [conviteId, usuarioId, novoStatusId],
  );

  return resultado;
}

export async function validarDestinatarioPorConviteId({ usuarioId, conviteId }) {
  const [resultado] = await knex.raw(
    `
    SELECT
      convite.id, convite.destinatario_id, convite.convite_status_id
    FROM convite
    JOIN projeto
    WHERE convite.id = ? AND destinatario_id = ?
    `,
    [conviteId, usuarioId],
  );

  return resultado[0];
}

export async function deletarConvite(conviteId) {
  const [resultado] = await knex.raw(
    `
    DELETE FROM convite
    WHERE id = ?
    `,
    [conviteId],
  );

  return resultado;
}

export async function obterPorConviteId(conviteId) {
  const [resultado] = await knex.raw(
    `
    SELECT *
    FROM convite
    WHERE id = ?
    `,
    [conviteId],
  );

  return resultado[0];
}

export async function excluirVarios({ convitesIds, projetoId }, db = knex) {
  const convitesExcluidos = await db('convite')
    .where({ projeto_id: projetoId })
    .whereIn('id', convitesIds)
    .del();

  return convitesExcluidos;
}

export async function atualizarNivelDeAcesso({ conviteId, nivelAcessoId }, db = knex) {
  const [resultado] = await db.raw(
    `
    UPDATE convite
    SET nivel_acesso_id = ?
    WHERE id = ?
    `,
    [nivelAcessoId, conviteId],
  );

  return resultado;
}
