import { Router } from 'express';
import  authRoutes  from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/user', userRoutes);

export default routes;
