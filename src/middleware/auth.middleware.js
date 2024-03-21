import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log("token", token);

    if (!token) throw new ErrorHandler(404, "Unauthorized Request");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ErrorHandler(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ErrorHandler(401, error?.message || "Invalid Access Token");
  }
});
