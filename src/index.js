import { app } from './app.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import chalk from 'chalk'

dotenv.config()
console.log(process.env.CLOUDINARY_SECRET_KEY)
const port = process.env.PORT || 8000

const yellowLog = chalk.yellow.bold

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(yellowLog('\nMongo DB Connected'))
    app.listen(port, () => {
      console.log(
        yellowLog(
          `app is listening to ${port} at ${new Date().toLocaleTimeString()} \n`
        )
      )
    })
  })
  .catch((err) => console.error("cann't start the app ", err))
