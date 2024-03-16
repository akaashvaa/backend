import { Router } from 'express'
import { registerUser } from '../controllers/user.controller.js'
import { upload } from '../middleware/multer.middleware.js'

const userRouter = Router()

userRouter.route('/register').post(
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  registerUser
)

/* or we can also do like this
router.get('/register',registerUser)
*/
export default userRouter
