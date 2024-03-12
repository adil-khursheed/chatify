import bodyParser from "body-parser";
import express, { Router } from "express";
import {
  createUpdateOrDeleteUser,
  getAllUsers,
} from "../controllers/user.controller";

const router = Router();

router
  .route("/webhook")
  .post(express.raw({ type: "application/json" }), createUpdateOrDeleteUser);

router.route("/").get(getAllUsers);

export default router;
