import { Router } from "express";
import {
  createAGroupChat,
  createOrGetAOneOnOneChat,
  getAllChats,
} from "../controllers/chat.controller";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = Router();

router.use(ClerkExpressRequireAuth());

router.route("/").get(getAllChats);
router.route("/:receiverId").post(createOrGetAOneOnOneChat);
router.route("/group").post(createAGroupChat);

export default router;
