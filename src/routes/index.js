import { Router } from 'express';
import authRoutes from './auth.router.js';
import usuarioRoutes from './usuario.router.js';
import projetoRoutes from './projeto.router.js';

const router = Router();

router.use(authRoutes);
router.use(usuarioRoutes);
router.use(projetoRoutes);

export default router;
