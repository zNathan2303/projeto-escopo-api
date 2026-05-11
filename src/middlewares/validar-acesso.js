import * as zodParam from '../utils/zod-param.js';
import * as usuarioProjetoModel from '../models/usuario-projeto.model.js';

export async function validarAcessoPorDocumentoId(req, res, next) {
  const usuarioId = req.usuario.id;
  const documentoId = zodParam.documentoId.parse(req.params.documentoId);

  const participacao = await usuarioProjetoModel.buscarParticipacaoDoUsuarioNoProjeto({
    projetoId,
    usuarioId,
  });

  if (!participacao) {
    throw new NotFoundError('Não foi encontrado o projeto com o ID informado');
  }

  req.usuario.nivelAcessoId = participacao.nivel_acesso_id;

  next();
}
