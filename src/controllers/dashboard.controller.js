import * as conviteModel from '../models/convite.model.js';
import * as documentoModel from '../models/documento.model.js';

export async function obterDadosDashboard(usuarioId) {
  const convites = await conviteModel.obterAtivosDeUsuario(usuarioId);
  const documentos = await documentoModel.obterModificadosRecentemente(usuarioId);

  return { convites, documentos };
}
