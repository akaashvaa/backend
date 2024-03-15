import { Router } from 'express'
import { registerUser } from '../controllers/user.controller.js'
const router = Router()

router.route('/register').post(registerUser)

/* or we can also do like this
router.get('/register',registerUser)
*/
export default router
