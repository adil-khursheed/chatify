import * as express from "express";
import { User } from "../index";
import { StrictAuthProp } from "@clerk/clerk-sdk-node";

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}
