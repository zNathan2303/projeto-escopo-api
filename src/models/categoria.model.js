import knex from '../config/database.js';

export async function criar({ titulo, projetoId }) {
  const [resultado] = await knex.raw(
    `
    INSERT INTO categoria (titulo, projeto_id)
    VALUES (?, ?)
    `,
    [titulo, projetoId],
  );

  return resultado; // Contém affectedRows e insertId
}

export async function desativar(categoriaId) {
  const horarioAtual = new Date();

  const [resultado] = await knex.raw(
    `
    UPDATE categoria
    SET deletado_em = ?
    WHERE id = ?
    `,
    [horarioAtual, categoriaId],
  );

  return resultado; // Contém affectedRows
}

export async function obterComDocumentos(projetoId, usuarioId) {
  const [resultado] = await knex.raw(
    `
    SELECT vw.projeto
    FROM vw_projeto_com_categorias_documentos vw
    JOIN usuario_projeto up
      ON up.projeto_id = vw.projeto_id
    JOIN usuario u
      ON u.id = up.usuario_id
    JOIN projeto p
      ON p.id = up.projeto_id
    WHERE vw.projeto_id = ?
      AND up.usuario_id = ?
      AND u.status = true
      AND p.deletado_em IS NULL
    `,
    [projetoId, usuarioId],
  );

  const [projetoComCategoriasEDocumentos] = resultado;

  return projetoComCategoriasEDocumentos;
}
