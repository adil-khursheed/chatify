import express, { Router } from "express";
import {
  createUpdateOrDeleteUser,
  getAllUsers,
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router
  .route("/webhook")
  .post(express.raw({ type: "application/json" }), createUpdateOrDeleteUser);

router.route("/").get(verifyJWT, getAllUsers);

export default router;
