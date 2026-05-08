import { Router } from 'express';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import { validarToken } from '../middlewares/auth.js';
import * as usuarioController from '../controllers/usuario.controller.js';

const router = Router();

router.patch('/usuario/nome', validarToken, verificarSeRequestTemBody, async (req, res) => {
  await usuarioController.atualizarNomeDoUsuario(req.usuario, req.body);
  res.sendStatus(204);
});

router.patch('/usuario/foto-perfil', validarToken, verificarSeRequestTemBody, async (req, res) => {
  await usuarioController.atualizarFotoPerfilDoUsuario(req.usuario, req.body);
  res.sendStatus(204);
});

router.delete('/usuario', validarToken, async (req, res) => {
  await usuarioController.desativarUsuario(req.usuario);
  res.sendStatus(204);
});

router.get('/usuario/email/:email', validarToken, async (req, res) => {
  const { email } = req.params;

  const usuario = await usuarioController.obterUsuarioPorEmail(email);

  res.status(200).json(usuario);
});

router.patch('/usuario/senha', validarToken, async (req, res) => {
  await usuarioController.atualizarSenhaDoUsuario(req.body, req.usuario.id);

  res.sendStatus(204);
});

export default router;
