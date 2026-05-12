import { Router } from 'express';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import * as comentarioController from '../controllers/comentario.controller.js';
import { validarToken } from '../middlewares/auth.js';
import { verificarParticipacaoPorDocumentoId } from '../models/usuario-projeto.model.js';

const router = Router();

router.post(
  '/documento/:documentoId/comentario',
  validarToken,
  verificarSeRequestTemBody,
  async (req, res) => {
    const { documentoId } = req.params;

    const resultado = await verificarParticipacaoPorDocumentoId({
      documentoId,
      usuarioId: req.usuario.id,
    });

    res.status(201).json(resultado);
  },
);

export default router;
