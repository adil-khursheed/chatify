import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
  host: "redis-3302e731-adilkhursheed60-72e1.a.aivencloud.com",
  port: 25400,
  username: "default",
  password: "AVNS_Qxbgepl6CAMtVKJ1q6F",
});
const sub = new Redis({
  host: "redis-3302e731-adilkhursheed60-72e1.a.aivencloud.com",
  port: 25400,
  username: "default",
  password: "AVNS_Qxbgepl6CAMtVKJ1q6F",
});

class SocketService {
  private _io: Server;
  constructor() {
    console.log("Init Socket Server...");

    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });

    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this.io;
    console.log("Init socket listeners...");

    io.on("connect", (socket) => {
      console.log(`New socket connected: ${socket.id}`);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log(`New message received - ${message}`);
        pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        io.emit("message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
