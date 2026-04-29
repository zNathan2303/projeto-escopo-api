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

router.get('/projetos', validarToken, async (req, res) => {
  const projetos = await projetoController.obterProjetosQueUsuarioEsta(
    req.usuario,
  );

  res.status(200).json(projetos);
});

router.get('/projeto/:id', validarToken, async (req, res) => {
  const { id } = req.params;

  const projeto = await projetoController.obterDetalhesDeUmProjeto(
    id,
    req.usuario,
  );

  res.status(200).json(projeto);
});

export default router;
