import { Types } from "mongoose";

export type EventType = "user.created" | "user.updated" | "user.deleted";

export type Event = {
  data: Record<string, string | number | any>;
  object: "event";
  type: EventType;
};

// === User Params ===
export type User = {
  _id: Types.ObjectId;
  clerkId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePhoto: string | undefined | null;
};
