import { Router } from 'express';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import { validarToken } from '../middlewares/auth.js';
import * as projetoController from '../controllers/projeto.controller.js';

const router = Router();

router.post(
  '/projeto',
  validarToken,
  verificarSeRequestTemBody,
  async (req, res) => {
    await projetoController.criarProjeto(req.body, req.usuario);

    res.sendStatus(201);
  },
);

export default router;
