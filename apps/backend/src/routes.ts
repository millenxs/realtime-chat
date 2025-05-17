import { Router } from 'express';
import authRoutes  from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import conversationRoutes from './modules/conversations/conversations.routes';
import messageRoutes from './modules/messages/message.routes'
import { verifyToken } from './middlewares/authMiddleware';

const routes = Router();

routes.get('/home', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Bem-vindo à página inicial!' });
});

routes.use('/auth', authRoutes);
routes.use('/user', userRoutes);
routes.use('/conversations', conversationRoutes);
routes.use('/messages', messageRoutes);

export default routes;
