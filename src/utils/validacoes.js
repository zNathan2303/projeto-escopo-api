import * as usuarioProjetoModel from '../models/usuario-projeto.model.js';

export async function validarPermissao({ usuarioID, projetoID, niveisDeAcessoIDs = [1, 2, 3, 4] }) {
  const permissao = await usuarioProjetoModel.verificarPermissaoDoUsuario({
    usuarioID,
    projetoID,
    niveisDeAcessoIDs,
  });

  return permissao;
}
