import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { RequireAuthProp } from "@clerk/clerk-sdk-node";
import { Chat } from "../models/chat.model";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";
import { Message } from "../models/message.model";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse";

const chatMessageCommonAggregation = () => {
  return [
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "sender",
        as: "sender",
        pipeline: [
          {
            $project: {
              username: 1,
              firstName: 1,
              lastName: 1,
              profilePhoto: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        sender: { $first: "$sender" },
      },
    },
  ];
};

const getAllMessages = asyncHandler(
  async (req: RequireAuthProp<Request>, res: Response) => {
    const { chatId } = req.params;

    const selectedChat = await Chat.findById(chatId);
    if (!selectedChat) {
      throw new ApiError(404, "Chat does not exist!");
    }

    const currentUser = await User.findOne({ clerkId: req.auth.userId });
    if (!currentUser) {
      throw new ApiError(404, "User does not exist!");
    }

    if (!selectedChat.participants?.includes(currentUser._id)) {
      throw new ApiError(400, "User is not a part of this chat!");
    }

    const messages = await Message.aggregate([
      {
        $match: {
          chat: new mongoose.Types.ObjectId(chatId),
        },
      },
      ...chatMessageCommonAggregation(),
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(200, messages || [], "Messages fetched successfully!")
      );
  }
);

const sendMessage = asyncHandler(
  async (req: RequireAuthProp<Request>, res: Response) => {
    const { chatId } = req.params;
    const { content } = req.body;

    // if (!content && !req.files?.attachments?.length) {
    //   throw new ApiError(400, "Message content or attachment is required!");
    // }

    // const selectedChat = await Chat.findById(chatId);

    // if (!selectedChat) {
    //   throw new ApiError(404, "Chat does not exist!");
    // }

    // const messageFiles = [];

    // if (req.files && req.files.attachments?.length > 0) {
    //   req.files.attachments?.map((attachment) => {});
    // }
  }
);

export { getAllMessages, sendMessage };
