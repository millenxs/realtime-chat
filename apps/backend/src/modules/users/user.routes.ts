import { Router } from 'express';
import { verifyToken } from '../../middlewares/authMiddleware';
import { getAllUsers } from "./user.controller";

const router = Router();

// GET / - protected route to get all users
router.get("/", verifyToken, getAllUsers); 

export default router;
