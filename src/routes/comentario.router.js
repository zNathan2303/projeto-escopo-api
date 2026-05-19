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

    const comentario = await comentarioController.criarComentario({
      documentoId,
      requestBody: req.body,
      usuarioId: req.usuario.id,
    });

    res.status(201).json(comentario);
  },
);

router.get(
  '/documento/:documentoId/comentarios',
  validarToken,
  validarAcessoPorDocumentoId,
  async (req, res) => {
    const { documentoId } = req.params;

    const comentarios = await comentarioController.obterComentariosPorDocumentoId(documentoId);

    res.status(200).json(comentarios);
  },
);

export default router;
