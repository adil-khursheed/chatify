import crypto from "crypto";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { RequireAuthProp } from "@clerk/clerk-sdk-node";
import { Chat } from "../models/chat.model";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";
import { Message } from "../models/message.model";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse";
import { getObjectURL, uploadObjectURL } from "../utils/aws-s3";
import SocketService from "../services/socket";
import { ChatEventEnum } from "../constants";

const socketService = new SocketService();

const randomFileKey = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

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
              clerkId: 1,
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

    if (
      !content &&
      !(req.files as { [fieldname: string]: Express.Multer.File[] })
        ?.attachments?.length
    ) {
      throw new ApiError(400, "Message content or attachment is required!");
    }

    const selectedChat = await Chat.findById(chatId);

    if (!selectedChat) {
      throw new ApiError(404, "Chat does not exist!");
    }

    const currentUser = await User.findOne({ clerkId: req.auth.userId });

    const messageFiles: { url: string; key: string }[] = [];

    if (
      req.files &&
      (req.files as { [fieldname: string]: Express.Multer.File[] }).attachments
        ?.length > 0
    ) {
      await Promise.all(
        (
          req.files as { [fieldname: string]: Express.Multer.File[] }
        ).attachments?.map(async (attachment: Express.Multer.File) => {
          const fileKey = randomFileKey();
          // upload file to aws bucket
          await uploadObjectURL(
            attachment.mimetype,
            fileKey,
            attachment.buffer
          );

          const url = await getObjectURL(fileKey);

          // push the returned url and key to messageFiles array
          messageFiles.push({
            url,
            key: fileKey,
          });
        })
      );
    }

    const message = await Message.create({
      sender: new mongoose.Types.ObjectId(currentUser?._id),
      content: content || "",
      chat: new mongoose.Types.ObjectId(chatId),
      attachments: messageFiles,
    });

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $set: {
          lastMessage: message._id,
        },
      },
      {
        new: true,
      }
    );

    const messages = await Message.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(message._id),
        },
      },
      ...chatMessageCommonAggregation(),
    ]);

    const receivedMessage = messages[0];

    if (!receivedMessage) {
      throw new ApiError(500, "Internal server error");
    }

    chat?.participants.forEach((participantObjectId) => {
      if (participantObjectId.toString() === currentUser?._id.toString())
        return;

      socketService.emitSocketEvent(
        participantObjectId.toString(),
        ChatEventEnum.MESSAGE_RECEIVED_EVENT,
        receivedMessage
      );
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, receivedMessage, "Message saved successfully!")
      );
  }
);

export { getAllMessages, sendMessage };
