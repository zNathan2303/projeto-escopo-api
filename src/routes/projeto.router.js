import { Router } from 'express';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import { validarToken } from '../middlewares/auth.js';
import * as projetoController from '../controllers/projeto.controller.js';

const router = Router();

router.post(
  'projeto',
  validarToken,
  verificarSeRequestTemBody,
  async (req, res) => {
    const projeto = await projetoController.criarProjeto(req.body, req.usuario);
    res.status(201).json(projeto);
  },
);

export default router;
