import express from "express";
import http from "http";
import SocketService from "./services/socket";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const httpServer = http.createServer(app);
const socketService = new SocketService();
socketService.io.attach(httpServer);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

export { httpServer, socketService };
