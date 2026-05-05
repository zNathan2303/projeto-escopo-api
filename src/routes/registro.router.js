import { Router } from 'express';
import { validarToken } from '../middlewares/auth.js';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import * as registroController from '../controllers/registro.controller.js';

const router = Router();

router.get('/projeto/:projetoId/registros', validarToken, async (req, res) => {
  const { projetoId } = req.params;

  const registros = await registroController.obterRegistrosDeUmProjeto(projetoId, req.usuario);

  res.status(200).json(registros);
});

router.post(
  '/projeto/:projetoId/registro',
  validarToken,
  verificarSeRequestTemBody,
  async (req, res) => {
    const { projetoId } = req.params;

    await registroController.criarRegistro(req.body, projetoId, req.usuario);

    res.sendStatus(201);
  },
);

export default router;
