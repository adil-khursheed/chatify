import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  createOrGetAOneOnOneChat,
  getAllChats,
} from "../controllers/chat.controller";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = Router();

router.use(ClerkExpressRequireAuth);

router.route("/").get(getAllChats);
router.route("/:receiverId").post(createOrGetAOneOnOneChat);

export default router;
