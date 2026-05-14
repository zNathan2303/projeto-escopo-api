import { Router } from 'express';
import { validarToken, validarAcessoPorNotificacaoId } from '../middlewares/auth.js';
// import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import * as notificacaoController from '../controllers/notificacao.controller.js';

const router = Router();

router.get('/notificacoes', validarToken, async (req, res) => {
  const notificacoes = await notificacaoController.obterNotificacoesPorUsuarioId(req.usuario.id);

  res.status(200).json(notificacoes);
});

router.patch(
  '/notificacao/:notificacaoId',
  validarToken,
  validarAcessoPorNotificacaoId,
  async (req, res) => {
    const { notificacaoId } = req.params;

    await notificacaoController.abrirNotificacao({
      notificacaoIdParam: notificacaoId,
    });

    res.sendStatus(204);
  },
);

export default router;
