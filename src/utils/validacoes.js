import * as usuarioProjetoModel from '../models/usuario-projeto.model.js';

export async function validarPermissao({ usuarioId, projetoId, niveisDeAcessoIds = [1, 2, 3, 4] }) {
  const permissao = await usuarioProjetoModel.verificarPermissaoDoUsuario({
    usuarioId,
    projetoId,
    niveisDeAcessoIds,
  });

  return permissao;
}
