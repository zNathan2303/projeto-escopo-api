import { Router } from 'express';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import * as comentarioController from '../controllers/comentario.controller.js';
import { validarToken, validarAcessoPorDocumentoId } from '../middlewares/auth.js';

const router = Router();

router.post(
  '/documento/:documentoId/comentario',
  validarToken,
  verificarSeRequestTemBody,
  validarAcessoPorDocumentoId,
  async (req, res) => {
    const { documentoId } = req.params;

    await comentarioController.criarComentario({
      documentoId,
      requestBody: req.body,
      usuarioId: req.usuario.id,
    });

    res.sendStatus(201);
  },
);

export default router;
