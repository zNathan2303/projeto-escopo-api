import { Router } from 'express';
import * as reuniaoController from '../controllers/reuniao.controller.js';
import { validarAcessoPorProjetoId, validarToken } from '../middlewares/auth.js';

const router = Router();

router.get(
  '/projeto/:projetoId/reunioes',
  validarToken,
  validarAcessoPorProjetoId,
  async (req, res) => {
    const { projetoId } = req.params;

    const reunioes = await reuniaoController.obterReunioesPorProjetoId(projetoId);

    res.status(200).json(reunioes);
  },
);

export default router;
