import { Router } from "express";
import {
  createAGroupChat,
  createOrGetAOneOnOneChat,
  getAllChats,
  getGroupChatDetails,
} from "../controllers/chat.controller";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = Router();

router.use(ClerkExpressRequireAuth());

router.route("/").get(getAllChats);
router.route("/group").post(createAGroupChat);
router.route("/group/:chatId").get(getGroupChatDetails);
router.route("/c/:receiverId").post(createOrGetAOneOnOneChat);

export default router;
