import { Router } from 'express';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import * as categoriaController from '../controllers/categoria.controller.js';
import {
  validarAcessoPorCategoriaId,
  validarAcessoPorProjetoId,
  validarPermissao,
  validarToken,
} from '../middlewares/auth.js';

const router = Router();

router.post(
  '/projeto/:projetoId/categoria',
  validarToken,
  verificarSeRequestTemBody,
  validarAcessoPorProjetoId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { projetoId } = req.params;

    const categoria = await categoriaController.criarCategoria({
      projetoIdParam: projetoId,
      requestBody: req.body,
    });

    res.status(201).json(categoria);
  },
);

router.delete(
  '/projeto/categoria/:categoriaId',
  validarToken,
  validarAcessoPorCategoriaId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { categoriaId } = req.params;

    await categoriaController.desativarCategoria(categoriaId);

    res.sendStatus(204);
  },
);

export default router;
