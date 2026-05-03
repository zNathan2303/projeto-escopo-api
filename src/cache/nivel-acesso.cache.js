const niveisAcessoIDsCache = {
  dados: null,
};

export async function obterIDsDeNiveisAcesso(db) {
  if (niveisAcessoIDsCache.dados) {
    return niveisAcessoIDsCache.dados;
  }

  const niveis = await db('nivel_acesso').select('id');
  niveisAcessoIDsCache.dados = niveis.map((n) => n.id);

  return niveisAcessoIDsCache.dados;
}
