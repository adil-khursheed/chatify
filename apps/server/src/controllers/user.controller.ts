import { Request, Response } from "express";

import { Webhook } from "svix";
import { asyncHandler } from "../utils/asyncHandler";
import conf from "../conf/conf";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";

const createUser = asyncHandler(async (req: Request, res: Response) => {
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

  let evt: any;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err: any) {
    console.log("Webhook failed to verify. Error: ", err.message);
    throw new ApiError(400, err.message);
  }

  const { id, email_addresses, username, first_name, last_name, image_url } =
    evt.data;
  const eventType = evt.type;

  console.log("Webhook body: ", evt.data);

  if (eventType === "user.created") {
    console.log(`User ${id} was ${eventType}`);

    await User.create({
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username,
      firstName: first_name,
      lastName: last_name,
      profilePhoto: image_url,
    });
  }

  const createdUser = await User.findOne({
    clerkId: id,
  });

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the user!");
  }

  console.log(createdUser);

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        createdUser,
        `Welcome ${createdUser.firstName} ${createdUser.lastName}`
      )
    );
});

export { createUser };
