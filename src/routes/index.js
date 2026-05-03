import { Router } from 'express';
import authRoutes from './auth.router.js';
import usuarioRoutes from './usuario.router.js';
import projetoRoutes from './projeto.router.js';
import dashboardRoutes from './dashboard.router.js';

const router = Router();

router.use(authRoutes);
router.use(usuarioRoutes);
router.use(projetoRoutes);
router.use(dashboardRoutes);

export default router;
