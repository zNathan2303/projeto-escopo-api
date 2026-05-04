import * as conviteModel from '../models/convite.model.js';
import * as documentoModel from '../models/documento.model.js';

export async function obterDadosDashboard(usuario) {
  const { id } = usuario;

  const convites = await conviteModel.obterAtivosDeUsuario(id);
  const documentos = await documentoModel.obterModificadosRecentemente(id);

  return { convites, documentos };
}
