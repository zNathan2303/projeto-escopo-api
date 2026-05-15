import { Router } from 'express';
import authRoutes from './auth.router.js';
import usuarioRoutes from './usuario.router.js';
import projetoRoutes from './projeto.router.js';
import dashboardRoutes from './dashboard.router.js';
import registroRoutes from './registro.router.js';
import categoriaRoutes from './categoria.router.js';
import documentoRoutes from './documento.router.js';
import comentarioRoutes from './comentario.router.js';
import reuniaoRoutes from './reuniao.router.js';
import linkRoutes from './link.router.js';
import convidadoReuniaoRoutes from './convidado-reuniao.router.js';
import conviteRoutes from './convite.router.js';
import notificacaoRoutes from './notificacao.router.js';

const router = Router();

router.use(authRoutes);
router.use(usuarioRoutes);
router.use(projetoRoutes);
router.use(dashboardRoutes);
router.use(registroRoutes);
router.use(categoriaRoutes);
router.use(documentoRoutes);
router.use(comentarioRoutes);
router.use(reuniaoRoutes);
router.use(linkRoutes);
router.use(convidadoReuniaoRoutes);
router.use(conviteRoutes);
router.use(notificacaoRoutes);

export default router;
