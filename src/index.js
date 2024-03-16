import { app } from './app.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import chalk from 'chalk'

dotenv.config({
  path: './env',
})

const port = process.env.PORT || 8000

const greenLog = chalk.yellow.bold

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(greenLog('\nMongo DB Connected'))
    app.listen(port, () => {
      console.log(
        greenLog(
          `app is listening to ${port} at ${new Date().toLocaleString()} \n`
        )
      )
    })
  })
  .catch((err) => console.error("cann't start the app ", err))
