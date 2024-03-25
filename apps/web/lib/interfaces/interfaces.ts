export interface IUser {
  _id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profilePhoto: string;
}

export interface IChatItem {
  _id: string;
  createdAt: string;
  isGroupChat: boolean;
  name: string;
  participants: IUser[];
  updatedAt: string;
  admin: string;
  lastMessage?: IChatMessage;
}

export interface IChatMessage {
  _id: string;
  sender: Pick<
    IUser,
    "_id" | "profilePhoto" | "email" | "username" | "clerkId"
  >;
  content: string;
  chat: string;
  attachments: {
    publicId: string;
    url: string;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
