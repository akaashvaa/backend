import {app} from './app.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({
  path : './env'
})

const port = process.env.PORT || 2000

mongoose.connect(process.env.MONGODB_URI).then( () => {
  console.log("Mongo DB Connected")
  app.listen(port, () => {
      console.log(`\n app is listening to ${port} at ${new Date()} \n`)
  })
}).catch(
    (err) =>  console.error("cann't start the app " , err) 
  )
