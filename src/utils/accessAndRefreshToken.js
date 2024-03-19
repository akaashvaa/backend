import { User } from '../models/user.model'
import { ErrorHandler } from './errorHandler'

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)

    const accessToken = user.generateAccessToken()

    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    user.save({ ValidateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new ErrorHandler(
      500,
      'something went wrong while generating access and refresh token'
    )
  }
}

export { generateAccessAndRefreshToken }
