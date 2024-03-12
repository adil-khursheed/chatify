import { Request, Response } from "express";

import { Webhook, WebhookRequiredHeaders } from "svix";
import { asyncHandler } from "../utils/asyncHandler";
import conf from "../conf/conf";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { Event, EventType } from "../types";
import { IncomingHttpHeaders } from "http";
import { Document } from "mongoose";
import jwt, { Secret } from "jsonwebtoken";

const createUpdateOrDeleteUser = asyncHandler(
  async (req: Request, res: Response) => {
    const WEBHOOK_SECRET = conf.webhookSecret;
    if (!WEBHOOK_SECRET) {
      throw new ApiError(404, "WEBHOOK_SECRET is missing!");
    }

    const svixHeaders = req.headers;
    const payload = req.body.toString();

    const svix_id = svixHeaders["svix-id"] as string;
    const svix_timestamp = svixHeaders["svix-timestamp"] as string;
    const svix_signature = svixHeaders["svix-signature"] as string;

    if (!svix_id || !svix_timestamp || !svix_signature) {
      throw new ApiError(400, "Error occurred -- no svix headers");
    }

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: Event | null = null;

    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      } as IncomingHttpHeaders & WebhookRequiredHeaders) as Event;
    } catch (err: any) {
      throw new ApiError(400, err.message);
    }

    const { id, email_addresses, username, first_name, last_name, image_url } =
      evt.data;

    const eventType: EventType = evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
      const user = await User.findOneAndUpdate(
        { clerkId: id },
        {
          $set: {
            email: email_addresses[0].email_address,
            username: username,
            firstName: first_name,
            lastName: last_name,
            profilePhoto: image_url,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );

      await user.save();

      return res
        .status(201)
        .json(new ApiResponse(200, user, `User created successfully!`));
    }

    if (eventType === "user.deleted") {
      await User.findOneAndDelete({ clerkId: id });

      return res
        .status(200)
        .json(new ApiResponse(200, {}, "User deleted successfully!"));
    }
  }
);

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { search } = req.query;

  const publishKey = process.env.CLERK_PEM_PUBLIC_KEY;
  let userId;
  try {
    const token =
      req.cookies.__session || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Unauthorized request!");
    }

    const decodedToken = jwt.verify(token, publishKey as Secret);

    const user = await User.findOne({ clerkId: decodedToken?.sub });

    if (!user) {
      throw new ApiError(401, "Invalid token!");
    }

    userId = user._id;
  } catch (err: any) {
    throw new ApiError(401, err?.message || "Invalid token!");
  }

  const userAggregation = User.aggregate<Document>([
    {
      $match: search?.length
        ? {
            $or: [
              {
                firstName: {
                  $regex: search as string,
                  $options: "i",
                },
              },
              {
                lastName: {
                  $regex: search as string,
                  $options: "i",
                },
              },
              {
                username: {
                  $regex: search as string,
                  $options: "i",
                },
              },
              {
                email: {
                  $regex: search as string,
                  $options: "i",
                },
              },
            ],
          }
        : {},
    },
    {
      $match: {
        _id: {
          $ne: userId,
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, userAggregation, "Users fetched successfully!"));
});
export { createUpdateOrDeleteUser, getAllUsers };
