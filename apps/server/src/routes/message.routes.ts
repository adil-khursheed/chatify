import { Router } from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { getAllMessages, sendMessage } from "../controllers/message.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.use(ClerkExpressRequireAuth());

router
  .route("/:chatId")
  .get(getAllMessages)
  .post(upload.fields([{ name: "attachments", maxCount: 10 }]), sendMessage);

export default router;
