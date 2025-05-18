import { Router } from 'express';
import { verifyToken } from '../../middlewares/authMiddleware';
import { getAllUsers, getUserById } from "./user.controller";

const router = Router();

// GET / - protected route to get all users
router.get("/", verifyToken, getAllUsers); 

// ✅ GET /user/:id - obter um único usuário por ID
router.get("/:id", verifyToken, getUserById);

export default router;
