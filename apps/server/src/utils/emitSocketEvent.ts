import { Request } from "express";
import { AvailableChatEvents } from "../constants";

export const emitSocketEvent = (
  req: Request,
  roomId: string,
  event: (typeof AvailableChatEvents)[0],
  payload: any
) => {
  req.app.get("io").in(roomId).emit(event, payload);
};
