import cookie from "cookie";
import jwt, { Secret } from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import Redis from "ioredis";
import conf from "../conf/conf";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";
import { User as UserType } from "../types";
import { ChatEventEnum } from "../constants";

const pub = new Redis({
  host: conf.redisHost,
  port: conf.redisPort,
  username: conf.redisUsername,
  password: conf.redisPassword,
});
const sub = new Redis({
  host: conf.redisHost,
  port: conf.redisPort,
  username: conf.redisUsername,
  password: conf.redisPassword,
});

declare module "socket.io" {
  interface Socket {
    user?: UserType;
  }
}

class SocketService {
  private _io: Server;
  constructor() {
    console.log("Init Socket Server...");

    this._io = new Server({
      pingTimeout: 60000,
      cors: {
        origin: conf.corsOrigin,
        credentials: true,
      },
    });

    sub.subscribe("MESSAGES");
  }

  mountJoinChatEvent = (socket: Socket) => {
    socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
      console.log("User joined the chat 🤝. ChatId: ", chatId);

      socket.join(chatId);
    });
  };

  mountParticipantTypingEvent = (socket: Socket) => {
    socket.on(ChatEventEnum.TYPING_EVENT, (chatId: string) => {
      socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
    });
  };

  mountParticipantStoppedTypingEvent = (socket: Socket) => {
    socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId: string) => {
      socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
    });
  };

  public initListeners() {
    const io = this.io;
    console.log("Init socket listeners...");

    io.on("connection", async (socket: Socket) => {
      console.log(`New socket connected: ${socket.id}`);

      try {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
        let token = cookies?.__session;

        if (!token) {
          token = socket.handshake.auth?.token;
        }

        if (!token) {
          throw new ApiError(401, "Unauthorized handshake. Token is missing!");
        }

        const decodedToken = jwt.verify(
          token,
          process.env.CLERK_PEM_PUBLIC_KEY as Secret
        );

        const user = await User.findOne({ clerkId: decodedToken?.sub });
        if (!user) {
          throw new ApiError(401, "Unauthorized request. Token is invalid.");
        }

        socket.user = {
          ...socket.user,
          _id: user._id,
          clerkId: user.clerkId,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          profilePhoto: user.profilePhoto,
        };

        socket.join(user._id.toString());
        socket.emit(ChatEventEnum.CONNECTED_EVENT);
        console.log("User connected 👤. userId: ", user._id.toString());

        this.mountJoinChatEvent(socket);
        this.mountParticipantTypingEvent(socket);
        this.mountParticipantStoppedTypingEvent(socket);

        socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
          console.log(
            "User has disconnected 🚫. userId: ",
            socket.user?._id.toString()
          );
          if (socket.user?._id) {
            socket.leave(socket.user?._id.toString());
          }
        });
      } catch (error: any) {
        socket.emit(
          ChatEventEnum.SOCKET_ERROR_EVENT,
          error.message ||
            "Something went wrong while connecting to the socket."
        );
      }
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
