import { NextFunction, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt, { Secret } from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler(
  async (req: Request, _, next: NextFunction) => {
    const publishKey = process.env.CLERK_SECRET_KEY;

    try {
      const token =
        req.cookies.__session || req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new ApiError(401, "Unauthorized request!");
      }

      console.log(token);

      const decodedToken = jwt.verify(token, publishKey as Secret);
      console.log(decodedToken);

      const user = await User.findOne({ clerkId: decodedToken?.sub });

      if (!user) {
        throw new ApiError(401, "Invalid token!");
      }

      req.user = {
        ...req.user,
        _id: user._id,
        clerkId: user.clerkId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        profilePhoto: user.profilePhoto,
      };
      next();
    } catch (err: any) {
      throw new ApiError(401, err?.message || "Invalid token!");
    }
  }
);
