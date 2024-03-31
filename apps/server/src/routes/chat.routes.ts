import { Router } from "express";
import {
  createAGroupChat,
  createOrGetAOneOnOneChat,
  getAllChats,
  getChatDetails,
} from "../controllers/chat.controller";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = Router();

router.use(ClerkExpressRequireAuth());

router.route("/").get(getAllChats);
router.route("/group").post(createAGroupChat);
router.route("/c/:chatId").get(getChatDetails);
router.route("/c/:receiverId").post(createOrGetAOneOnOneChat);

export default router;
