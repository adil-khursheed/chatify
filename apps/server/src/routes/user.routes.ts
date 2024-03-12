import bodyParser from "body-parser";
import express, { Router } from "express";
import { createUpdateOrDeleteUser } from "../controllers/user.controller";

const router = Router();

router
  .route("/webhook")
  .post(express.raw({ type: "application/json" }), createUpdateOrDeleteUser);

export default router;
