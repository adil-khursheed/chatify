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

app.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/users/webhook") {
    next();
  } else {
    express.json({ limit: "16kb" })(req, res, next);
  }
});
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRoute from "./routes/user.routes";

// routes declaration
app.use("/api/v1/users", userRoute);

export { httpServer, socketService };
