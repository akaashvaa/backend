import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { uploadOnCloudaniry } from "../utils/cloudinary.js";
import { ResponseHandler } from "../utils/responseHandler.js";
import { generateAccessAndRefreshToken } from "../utils/accessAndRefreshToken.js";

const registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, email, userName, password } = req.body;

  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ErrorHandler(400, "All fields are required");
  }

  const isAlreadyExist = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (isAlreadyExist) throw new ErrorHandler(409, "user already exist");

  const avatarLocalPath = await req.files?.avatar[0]?.path;
  const coverImageLocalPath = await req.files?.coverImage[0]?.path;
  console.log("path", avatarLocalPath);

  if (!avatarLocalPath) throw new ErrorHandler(400, "avatar file is required");

  const avatar = await uploadOnCloudaniry(avatarLocalPath);
  const coverImage = await uploadOnCloudaniry(coverImageLocalPath);

  if (!avatar) throw new ErrorHandler(400, "avatar file is required");

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    userName: userName.toLowerCase(),
    password,
  });

  const createduser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createduser)
    throw new ErrorHandler(500, "something went wrong while creating user");

  console.log("created user", createduser);

  return res
    .status(201)
    .json(
      new ResponseHandler(200, createduser, "user registered successfully")
    );
});

const loginUser = asyncHandler(async (req, res, next) => {
  /**
   * req.body se input
   * user exist or not
   * validation
   * password check
   * access and refresh token
   * send cookie
   * res.json
   */
  const { userName, email, password } = req.body;
  if (!userName && !email) {
    throw new ErrorHandler(400, "username or email is required");
  }
  const user = await User.findOne({ $or: [{ userName }, { email }] });

  if (!user) throw new ErrorHandler(404, "User Not Found");
  await user.isPasswordCorrect(password);
  if (!password) throw new ErrorHandler(401, "Password Incorrect");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ResponseHandler(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In Successfully!"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(
    _id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ResponseHandler(200, "User Logged Out Successfully!"));
});

const refreshedAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken)
    throw new ErrorHandler(401, "Unauthorized Request");

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await User.findById(decodedToken?._id);
  if (!user) throw new ErrorHandler(401, "Invalid Refresh Token");

  if (incomingRefreshToken !== user?.refreshToken)
    throw new ErrorHandler(401, "Refresh token is expired or used");

  const options = {
    httpOnly: true,
    secure: true,
  };
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ResponseHandler(
        200,
        { accessToken, refreshToken },
        "Access token refreshed successfully"
      )
    );
});

export { registerUser, loginUser, logoutUser, refreshedAccessToken };
