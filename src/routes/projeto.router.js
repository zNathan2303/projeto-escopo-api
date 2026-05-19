import { Router } from 'express';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import { validarToken, validarPermissao, validarAcessoPorProjetoId } from '../middlewares/auth.js';
import * as projetoController from '../controllers/projeto.controller.js';

const router = Router();

router.post('/projeto', validarToken, verificarSeRequestTemBody, async (req, res) => {
  const projeto = await projetoController.criarProjeto({
    requestBody: req.body,
    usuarioId: req.usuario.id,
  });

  res.status(201).json(projeto);
});

router.get('/projetos', validarToken, async (req, res) => {
  const projetos = await projetoController.obterProjetosQueUsuarioParticipa(req.usuario.id);

  res.status(200).json(projetos);
});

router.get('/projeto/:projetoId', validarToken, async (req, res) => {
  const { projetoId } = req.params;

  const projeto = await projetoController.obterDetalhesDeUmProjeto({
    projetoIdParam: projetoId,
    usuarioId: req.usuario.id,
  });

  res.status(200).json(projeto);
});

router.put(
  '/projeto/:projetoId',
  validarToken,
  verificarSeRequestTemBody,
  validarAcessoPorProjetoId,
  validarPermissao([1]),
  async (req, res) => {
    const { projetoId } = req.params;

    const projeto = await projetoController.atualizarProjeto({
      projetoIdParam: projetoId,
      requestBody: req.body,
      usuarioId: req.usuario.id,
    });

    res.status(200).json(projeto);
  },
);

router.delete(
  '/projeto/:projetoId',
  validarToken,
  validarAcessoPorProjetoId,
  validarPermissao([1]),
  async (req, res) => {
    const { projetoId } = req.params;

    await projetoController.desativarProjeto(projetoId);

    res.sendStatus(204);
  },
);

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
