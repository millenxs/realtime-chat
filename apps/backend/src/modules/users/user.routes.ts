<<<<<<< HEAD
export const userRoutes = []
=======
import { Router } from 'express';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/home', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Bem-vindo à página inicial!' });
});

export default router;
>>>>>>> origin/login-register-authentication
