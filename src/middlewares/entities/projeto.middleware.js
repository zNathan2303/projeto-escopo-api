import * as usuarioProjetoModel from '../../models/usuario-projeto.model.js';
import NotFoundError from '../../errors/NotFoundError.js';

export async function validarAcessoPorProjetoIdDeConvite(req, res, next) {
  const usuarioId = req.usuario.id;
  const projetoId = req.convite.projeto_id;

  const participacao = await usuarioProjetoModel.verificarParticipacaoPorProjetoId({
    projetoId,
    usuarioId,
  });

  if (!participacao) {
    throw new NotFoundError('Não foi encontrado o projeto que o convite pertence');
  }

  req.usuario.nivelAcessoId = participacao.nivel_acesso_id;

  next();
}
