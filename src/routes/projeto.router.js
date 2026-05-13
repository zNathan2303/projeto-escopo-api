import { Router } from 'express';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import { validarToken, validarPermissao, validarAcessoPorProjetoId } from '../middlewares/auth.js';
import * as projetoController from '../controllers/projeto.controller.js';

const router = Router();

router.post('/projeto', validarToken, verificarSeRequestTemBody, async (req, res) => {
  await projetoController.criarProjeto(req.body, req.usuario);

  res.sendStatus(201);
});

router.get('/projetos', validarToken, async (req, res) => {
  const projetos = await projetoController.obterProjetosQueUsuarioParticipa(req.usuario);

  res.status(200).json(projetos);
});

router.get('/projeto/:id', validarToken, async (req, res) => {
  const { id } = req.params;

  const projeto = await projetoController.obterDetalhesDeUmProjeto(id, req.usuario);

  res.status(200).json(projeto);
});

router.put('/projeto/:id', validarToken, verificarSeRequestTemBody, async (req, res) => {
  const { id } = req.params;

  const projeto = await projetoController.atualizarProjeto(req.body, id, req.usuario);

  res.status(200).json(projeto);
});

router.delete('/projeto/:id', validarToken, async (req, res) => {
  const { id } = req.params;

  await projetoController.excluirProjeto(id, req.usuario);

  res.sendStatus(204);
});

router.get(
  '/projeto/:projetoId/participantes',
  validarToken,
  validarAcessoPorProjetoId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { projetoId } = req.params;

    const participantes = await projetoController.obterParticipantesDeUmProjeto(projetoId);

    res.status(200).json(participantes);
  },
);

export default router;
