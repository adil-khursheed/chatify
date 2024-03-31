import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
// import { emitSocketEvent } from "../utils/emitSocketEvent";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { Chat } from "../models/chat.model";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse";
import { ChatEventEnum } from "../constants";
import { RequireAuthProp } from "@clerk/clerk-sdk-node";
import SocketService from "../services/socket";
import { TUser } from "../types";

const socketService = new SocketService();

const chatCommonAggregation = () => {
  return [
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "participants",
        as: "participants",
      },
    },
    {
      $lookup: {
        from: "messages",
        foreignField: "_id",
        localField: "lastMessage",
        as: "lastMessage",
        pipeline: [
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "sender",
              as: "sender",
            },
          },
          {
            $addFields: {
              sender: { $first: "$sender" },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        lastMessage: { $first: "$lastMessage" },
      },
    },
  ];
};

const createOrGetAOneOnOneChat = asyncHandler(
  async (req: RequireAuthProp<Request>, res: Response) => {
    const { receiverId } = req.params;

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      throw new ApiError(401, "Receiver does not exist!");
    }

    if (receiver.clerkId.toString() === req.auth.userId.toString()) {
      throw new ApiError(400, "You cannot chat with yourself!");
    }

    const currentUser = await User.findOne({ clerkId: req.auth.userId });

    const chat = await Chat.aggregate([
      {
        $match: {
          isGroupChat: false,
          $and: [
            {
              participants: { $elemMatch: { $eq: currentUser?._id } },
            },
            {
              participants: {
                $elemMatch: { $eq: new mongoose.Types.ObjectId(receiverId) },
              },
            },
          ],
        },
      },
      ...chatCommonAggregation(),
    ]);

    if (chat.length) {
      return res
        .status(200)
        .json(new ApiResponse(200, chat[0], "Chat retrieved successfully!"));
    }

    const newChatInstance = await Chat.create({
      name: "one on one chat",
      participants: [currentUser?._id, new mongoose.Types.ObjectId(receiverId)],
      admin: currentUser?._id,
    });

    const createdChat = await Chat.aggregate([
      {
        $match: {
          _id: newChatInstance._id,
        },
      },
      ...chatCommonAggregation(),
    ]);

    const payload = createdChat[0];

    if (!payload) {
      throw new ApiError(500, "Internal server Error!");
    }

    payload?.participants?.forEach((participant: TUser) => {
      if (participant._id.toString() === currentUser?._id.toString()) return;

      socketService.emitSocketEvent(
        participant._id?.toString(),
        ChatEventEnum.NEW_CHAT_EVENT,
        payload
      );
    });

    return res
      .status(201)
      .json(new ApiResponse(201, payload, "Chat created successfully!"));
  }
);

const createAGroupChat = asyncHandler(
  async (req: RequireAuthProp<Request>, res: Response) => {
    const { name, participants } = req.body;

    const currentUser = await User.findOne({ clerkId: req.auth.userId });

    if (participants.includes(currentUser?._id.toString())) {
      throw new ApiError(
        400,
        "Participant array should not contain the group creator"
      );
    }

    const members = [
      ...new Set([...participants, currentUser?._id.toString()]),
    ];

    if (members.length < 3) {
      throw new ApiError(
        400,
        "Seems like you have passed duplicate participants"
      );
    }

    const groupChat = await Chat.create({
      name,
      isGroupChat: true,
      participants: members,
      admin: currentUser?._id,
    });

    const chat = await Chat.aggregate([
      {
        $match: {
          _id: groupChat._id,
        },
      },
      ...chatCommonAggregation(),
    ]);

    const payload = chat[0];

    if (!payload) {
      throw new ApiError(500, "Internal server error");
    }

    payload?.participants?.forEach((participant: TUser) => {
      if (participant._id.toString() === currentUser?._id.toString()) return;

      socketService.emitSocketEvent(
        participant._id?.toString(),
        ChatEventEnum.NEW_CHAT_EVENT,
        payload
      );
    });

    return res
      .status(201)
      .json(new ApiResponse(201, payload, "Group chat created successfully!"));
  }
);

const getChatDetails = asyncHandler(
  async (req: RequireAuthProp<Request>, res: Response) => {
    const { chatId } = req.params;

    const chat = await Chat.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(chatId),
        },
      },
      ...chatCommonAggregation(),
    ]);

    if (!chat.length) {
      throw new ApiError(404, "Chat does not exist!");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, chat[0], "Chat fetched successfully!"));
  }
);

const getAllChats = asyncHandler(
  async (req: RequireAuthProp<Request>, res: Response) => {
    const currentUser = await User.findOne({ clerkId: req.auth.userId });

    const chats = await Chat.aggregate([
      {
        $match: {
          participants: {
            $elemMatch: { $eq: currentUser?._id },
          },
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      ...chatCommonAggregation(),
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(200, chats || [], "User chats fetched successfully!")
      );
  }
);

export {
  createOrGetAOneOnOneChat,
  createAGroupChat,
  getChatDetails,
  getAllChats,
};
