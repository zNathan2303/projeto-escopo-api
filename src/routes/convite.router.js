import { Router } from 'express';
import {
  validarToken,
  validarAcessoPorConviteId,
  validarTransicaoStatusConvite,
} from '../middlewares/auth.js';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import * as conviteController from '../controllers/convite.controller.js';

const router = Router();

router.patch(
  '/convite/:id',
  validarToken,
  verificarSeRequestTemBody,
  validarAcessoPorConviteId,
  validarTransicaoStatusConvite,
  async (req, res) => {
    const { conviteId } = req.params;

    await conviteController.atualizarConviteStatus({
      conviteIdParam: conviteId,
      requestBody: req.body,
      usuarioId: req.usuario_id,
    });

    res.sendStatus(204);
  },
);

export default router;
