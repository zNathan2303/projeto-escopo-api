import { Router } from 'express';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import * as categoriaController from '../controllers/categoria.controller.js';
import { validarToken } from '../middlewares/auth.js';

const router = Router();

router.post(
  '/projeto/:projetoId/categoria',
  validarToken,
  verificarSeRequestTemBody,
  async (req, res) => {
    const { projetoId } = req.params;

    await categoriaController.criarCategoria(req.body, projetoId, req.usuario.id);

    res.sendStatus(201);
  },
);

router.delete('/projeto/:projetoId/categoria/:categoriaId', validarToken, async (req, res) => {
  const { projetoId, categoriaId } = req.params;

  await categoriaController.excluirCategoria(categoriaId, projetoId, req.usuario.id);

  res.sendStatus(204);
});

export default router;
