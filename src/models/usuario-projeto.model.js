import knex from '../config/database.js';

export async function verificarParticipacaoPorProjetoId({ usuarioId, projetoId }) {
  const [resultado] = await knex.raw(
    `
    SELECT up.nivel_acesso_id
    FROM usuario_projeto AS up
    JOIN projeto AS p
      ON p.id = up.projeto_id
    JOIN usuario AS u
      ON u.id = up.usuario_id
    WHERE up.usuario_id = ?
      AND p.id = ?
      AND u.status = true
      AND p.deletado_em IS NULL
    `,
    [usuarioId, projetoId],
  );

  return resultado[0];
}

export async function verificarParticipacaoPorDocumentoId({ usuarioId, documentoId }) {
  const [resultado] = await knex.raw(
    `
    SELECT up.nivel_acesso_id
    FROM usuario_projeto AS up
    JOIN projeto AS p
      ON p.id = up.projeto_id
    JOIN categoria AS c
      ON c.projeto_id = p.id
    JOIN documento AS d
      ON d.categoria_id = c.id
    JOIN usuario AS u
      ON u.id = up.usuario_id
    WHERE up.usuario_id = ?
      AND d.id = ?
      AND u.status = true
      AND p.deletado_em IS NULL
      AND d.deletado_em IS NULL
      AND c.deletado_em IS NULL
    `,
    [usuarioId, documentoId],
  );

  return resultado[0];
}

export async function verificarParticipacaoPorRegistroId({ usuarioId, registroId }) {
  const [resultado] = await knex.raw(
    `
    SELECT up.nivel_acesso_id
    FROM usuario_projeto AS up
    JOIN projeto AS p
      ON p.id = up.projeto_id
    JOIN registro AS r
      ON r.projeto_id = p.id
    JOIN usuario AS u
      ON u.id = up.usuario_id
    WHERE up.usuario_id = ?
      AND r.id = ?
      AND u.status = true
      AND p.deletado_em IS NULL
    `,
    [usuarioId, registroId],
  );

  return resultado[0];
}

export async function verificarParticipacaoPorCategoriaId({ usuarioId, categoriaId }) {
  const [resultado] = await knex.raw(
    `
    SELECT up.nivel_acesso_id
    FROM usuario_projeto AS up
    JOIN projeto AS p
      ON p.id = up.projeto_id
    JOIN categoria AS c
      ON c.projeto_id = p.id
    JOIN usuario AS u
      ON u.id = up.usuario_id
    WHERE up.usuario_id = ?
      AND c.id = ?
      AND u.status = true
      AND p.deletado_em IS NULL
      AND c.deletado_em IS NULL
    `,
    [usuarioId, categoriaId],
  );

  return resultado[0];
}

export async function verificarParticipacaoPorDocumentoVersaoId({ usuarioId, documentoVersaoId }) {
  const [resultado] = await knex.raw(
    `
    SELECT up.nivel_acesso_id
    FROM usuario_projeto AS up
    JOIN projeto AS p
      ON p.id = up.projeto_id
    JOIN categoria AS c
      ON c.projeto_id = up.projeto_id
    JOIN documento AS d
      ON d.categoria_id = c.id
    JOIN documento_versao AS dv
      ON dv.documento_id = d.id
    JOIN usuario AS u
      ON u.id = up.usuario_id
    WHERE up.usuario_id = ?
      AND dv.id = ?
      AND u.status = true
      AND p.deletado_em IS NULL
      AND d.deletado_em IS NULL
      AND c.deletado_em IS NULL
    `,
    [usuarioId, documentoVersaoId],
  );

  return resultado[0];
}

export async function verificarParticipacaoPorReuniaoId({ usuarioId, reuniaoId }) {
  const [resultado] = await knex.raw(
    `
    SELECT up.nivel_acesso_id
    FROM usuario_projeto AS up
    JOIN projeto AS p
      ON p.id = up.projeto_id
    JOIN reuniao AS r
      ON r.projeto_id = p.id
    JOIN usuario AS u
      ON u.id = up.usuario_id
    WHERE up.usuario_id = ?
      AND r.id = ?
      AND u.status = true
      AND p.deletado_em IS NULL
    `,
    [usuarioId, reuniaoId],
  );

  return resultado[0];
}

export async function verificarParticipacaoPorLinkId({ usuarioId, linkId }) {
  const [resultado] = await knex.raw(
    `
    SELECT up.nivel_acesso_id
    FROM usuario_projeto AS up
    JOIN projeto AS p
      ON p.id = up.projeto_id
    JOIN reuniao AS r
      ON r.projeto_id = p.id
    JOIN link AS l
      ON l.reuniao_id = r.id
    JOIN usuario AS u
      ON u.id = up.usuario_id
    WHERE up.usuario_id = ?
      AND l.id = ?
      AND u.status = true
      AND p.deletado_em IS NULL
    `,
    [usuarioId, linkId],
  );

  return resultado[0];
}

export async function verificarParticipacaoPorConvidadoReuniaoId({
  usuarioId,
  convidadoReuniaoId,
}) {
  const [resultado] = await knex.raw(
    `
    SELECT up.nivel_acesso_id
    FROM usuario_projeto AS up
    JOIN projeto AS p
      ON p.id = up.projeto_id
    JOIN reuniao AS r
      ON r.projeto_id = p.id
    JOIN convidado_reuniao AS cr
      ON cr.reuniao_id = r.id
    JOIN usuario AS u
      ON u.id = up.usuario_id
    WHERE up.usuario_id = ?
      AND cr.id = ?
      AND u.status = true
      AND p.deletado_em IS NULL
    `,
    [usuarioId, convidadoReuniaoId],
  );

  return resultado[0];
}

export async function verificarParticipacaoPorReuniaoUsuarioId({ usuarioId, reuniaoUsuarioId }) {
  const [resultado] = await knex.raw(
    `
    SELECT up.nivel_acesso_id
    FROM usuario_projeto AS up
    JOIN projeto AS p
      ON p.id = up.projeto_id
    JOIN reuniao AS r
      ON r.projeto_id = p.id
    JOIN reuniao_usuario AS ru
      ON ru.reuniao_id = r.id
    JOIN usuario AS u
      ON u.id = up.usuario_id
    WHERE up.usuario_id = ?
      AND ru.id = ?
      AND u.status = true
      AND p.deletado_em IS NULL
    `,
    [usuarioId, reuniaoUsuarioId],
  );

  return resultado[0];
}
