import express, { Router } from "express";
import {
  createUpdateOrDeleteUser,
  getAllUsers,
} from "../controllers/user.controller";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = Router();

router
  .route("/webhook")
  .post(express.raw({ type: "application/json" }), createUpdateOrDeleteUser);

router.route("/").get(ClerkExpressRequireAuth(), getAllUsers);

export default router;
