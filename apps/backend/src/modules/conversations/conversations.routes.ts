import { Router } from 'express';
import { verifyToken } from '../../middlewares/authMiddleware';
import * as conversationController from '../conversations/conversations.controller';

const router = Router();

router.get('/', verifyToken, conversationController.getUserConversations);
router.post('/', verifyToken, conversationController.createConversation);

export default router;
