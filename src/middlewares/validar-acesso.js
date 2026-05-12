import * as zodParam from '../utils/zod-param.js';
import * as usuarioProjetoModel from '../models/usuario-projeto.model.js';
import NotFoundError from '../errors/NotFoundError.js';

export async function validarAcessoPorDocumentoId(req, res, next) {
  const usuarioId = req.usuario.id;
  const documentoId = zodParam.documentoId.parse(req.params.documentoId);

  const participacao = await usuarioProjetoModel.verificarParticipacaoPorDocumentoId({
    documentoId,
    usuarioId,
  });

  if (!participacao) {
    throw new NotFoundError('Não foi encontrado o documento com o ID informado');
  }

  req.usuario.nivelAcessoId = participacao.nivel_acesso_id;

  next();
}

export async function validarAcessoPorProjetoId(req, res, next) {
  const usuarioId = req.usuario.id;
  const projetoId = zodParam.projetoId.parse(req.params.projetoId);

  const participacao = await usuarioProjetoModel.verificarParticipacaoPorProjetoId({
    projetoId,
    usuarioId,
  });

  if (!participacao) {
    throw new NotFoundError('Não foi encontrado o projeto com o ID informado');
  }

  req.usuario.nivelAcessoId = participacao.nivel_acesso_id;

  next();
}
