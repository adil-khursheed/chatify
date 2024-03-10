import dotenv from "dotenv";
import { httpServer, socketService } from "./app.js";
import connectDB from "./db/index.js";
import conf from "./conf/conf.js";

dotenv.config({
  path: "./env",
});

async function startServer() {
  const PORT = conf.serverPort ? conf.serverPort : 5000;

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
