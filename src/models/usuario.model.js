import knex from '../config/database.js';

export async function cadastrar({ email, nome, senha }) {
  const resultado = await knex.raw(
    `
    CALL criar_usuario(?, ?, ?)
    `,
    [nome, email, senha],
  );

  const { id } = resultado[0][0][0];

  return id;
}

export async function obterComSenhaPorEmail(email) {
  const [resultado] = await knex.raw(
    `
    SELECT id, nome, email, senha
    FROM usuario
    WHERE email = ?
      AND status = true
    `,
    [email],
  );

  const [usuario] = resultado;

  return usuario;
}

export async function atualizarNome(id, nome) {
  await knex.raw(
    `
    UPDATE usuario
      SET nome = ?
    WHERE id = ?
      AND status = true
    `,
    [nome, id],
  );
}

export async function atualizarFotoPerfil(id, fotoPerfil) {
  await knex.raw(
    `
    UPDATE usuario
      SET foto_perfil = ?
    WHERE id = ?
      AND status = true
    `,
    [fotoPerfil, id],
  );
}

export async function desativar(id) {
  await knex.raw(
    `
    UPDATE usuario
      SET status = false
    WHERE id = ?
      AND status = true
    `,
    [id],
  );
}

export async function obterPorEmail(email) {
  const [resultado] = await knex.raw(
    `
    SELECT id, nome, email, foto_perfil
    FROM usuario
    WHERE email = ?
      AND status = true
    `,
    [email],
  );

  const [usuario] = resultado;

  return usuario;
}

export async function obterTodosPorProjetoId(projetoId) {
  const [resultado] = await knex.raw(
    `
    SELECT * FROM vw_usuarios_projetos
	  WHERE projeto_id = ?
    `,
    [projetoId],
  );

  const [usuariosEConvites] = resultado;

  return usuariosEConvites;
}

export async function atualizarSenha({ usuarioId, senha }) {
  await knex.raw(
    `
    UPDATE usuario
      SET senha = ?
    WHERE id = ?
      AND status = true
    `,
    [senha, usuarioId],
  );
}
