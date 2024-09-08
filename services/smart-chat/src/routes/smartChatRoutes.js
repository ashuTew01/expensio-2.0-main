import express from "express";
import { smartChatTestController } from "../controllers/smartChatController.js";

const router = express.Router();

router.get("/test", smartChatTestController);

export default router;
