import bodyParser from "body-parser";
import { Router } from "express";
import { createUser } from "../controllers/user.controller";

const router = Router();

router
  .route("/webhook")
  .post(bodyParser.raw({ type: "application/json" }), createUser);

export default router;
