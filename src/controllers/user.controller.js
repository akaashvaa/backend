import { asyncHandler } from '../utils/asyncHandler.js'
import { ErrorHandler } from '../utils/errorHandler.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudaniry } from '../utils/cloudinary.js'
import { ResponseHandler } from '../utils/responseHandler.js'
import { clearConfigCache } from 'prettier'

const registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, email, username, password } = req.body

  if (
    [fullName, email, username, password].some((field) => field?.trim() === '')
  ) {
    throw new ErrorHandler(400, 'All fields are required')
  }

  const isAlreadyExist = await User.findOne({
    $or: [{ username }, { email }],
  })

  if (isAlreadyExist) throw new ErrorHandler(409, 'user already exist')

  const avatarLocalPath = req.files?.avatar[0]?.path
  const coverImageLocalPath = req.files?.coverImage[0]?.path
  console.log('path', avatarLocalPath)

  if (!avatarLocalPath) throw new ErrorHandler(400, 'avatar file is required')

  const avatar = await uploadOnCloudaniry(avatarLocalPath)
  const coverImage = await uploadOnCloudaniry(coverImageLocalPath)
  if (!avatar)
    throw new ErrorHandler(500, 'error on avatar on upload tro cloudinary')
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || '',
    email,
    username: username.toLowerCase(),
    password,
  })

  const createduser = await User.findById(user._id).select(
    '-password -refreshToken'
  )
  if (!createduser)
    throw new ErrorHandler(500, 'something went wrong while creating user')

  console.log('created user', createduser)

  res
    .status(201)
    .json(new ResponseHandler(200, createduser, 'user registered successfully'))
})
export { registerUser }
