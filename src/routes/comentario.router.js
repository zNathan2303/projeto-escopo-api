import { Router } from 'express';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import * as comentarioController from '../controllers/comentario.controller.js';
import { validarToken } from '../middlewares/auth.js';
import { buscarUsuarioPorDocumentoId } from '../models/usuario-projeto.model.js';

const router = Router();

router.post(
  'documento/:documentoId/comentario',
  validarToken,
  verificarSeRequestTemBody,
  async (req, res) => {
    const { documentoId } = req.params;

    const resultado = await buscarUsuarioPorDocumentoId(1, 1);

    res.status(201).json(resultado);
  },
);

export default router;
