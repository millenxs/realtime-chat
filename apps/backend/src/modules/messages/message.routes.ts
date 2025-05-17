import { Router } from "express";
import { getMessagesController, postMessageController } from "./message.controller";
import { verifyToken } from "../../middlewares/authMiddleware";

const router = Router();

router.get("/", verifyToken, getMessagesController);
router.post("/", verifyToken, postMessageController);

export default router;
