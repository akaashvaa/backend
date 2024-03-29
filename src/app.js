import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cookieParser())

//route declaration
import userRouter from './routes/user.routes.js'

app.use('/api/v1/users', userRouter)

//check
app.get('/', (_, res) => {
  res.status(200).json({
    message: 'api is working',
  })
})

export { app }
