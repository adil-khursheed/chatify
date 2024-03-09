import dotenv from "dotenv";
import { httpServer, socketService } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

async function startServer() {
  const PORT = process.env.PORT ? process.env.PORT : 5000;

  httpServer.listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`);
  });

  socketService.initListeners();
}

connectDB()
  .then(() => {
    startServer();
  })
  .catch((err) => {
    console.log("Index.ts :: MongoDB connection error: ", err);
  });
