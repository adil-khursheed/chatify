import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { emitSocketEvent } from "../utils/emitSocketEvent";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { Chat } from "../models/chat.model";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse";
import { ChatEventEnum } from "../constants";

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
  async (req: Request, res: Response) => {
    const { receiverId } = req.params;

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      throw new ApiError(401, "Receiver does not exist!");
    }

    if (receiver._id.toString() === req.user?._id.toString()) {
      throw new ApiError(400, "You cannot chat with yourself!");
    }

    const chat = await Chat.aggregate([
      {
        $match: {
          isGroupChat: false,
          $and: [
            {
              participants: { $elemMatch: { $eq: req.user?._id } },
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
      participants: [req.user?._id, new mongoose.Types.ObjectId(receiverId)],
      admin: req.user?._id,
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

    payload?.participants?.forEach((participant: any) => {
      if (participant._id.toString() === req.user?._id.toString()) return;

      emitSocketEvent(
        req,
        participant._id.toString(),
        ChatEventEnum.NEW_CHAT_EVENT,
        payload
      );
    });

    return res
      .status(201)
      .json(new ApiResponse(200, payload, "Chat created successfully!"));
  }
);

const getAllChats = asyncHandler(async (req: Request, res: Response) => {
  const chats = await Chat.aggregate([
    {
      $match: {
        participants: {
          $elemMatch: { $eq: req.user?._id },
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
});

export { createOrGetAOneOnOneChat, getAllChats };
