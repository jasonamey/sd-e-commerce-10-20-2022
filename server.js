const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const connectDB =  require('./db/connect')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const orderRouter = require('./routes/orderRoutes')

const errorHandlerMiddleware = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')

const app = express()

const port = process.env.PORT || 5000

app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

app.use(express.static('./public'))
app.use(fileUpload())

console.log("TESTING VARIBLES", process.env)

app.get('/', (req, res, next) => {
  console.log(req.signedCookies)
  res.json({"msg": "connected"})
})

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/products', productRouter)
app.use('/reviews', reviewRouter)
app.use('/orders', orderRouter)

app.use(notFound)
app.use(errorHandlerMiddleware)



const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`app is listening at port ${port}. horay!`)
    })
    await connectDB(process.env.MONGODB_URL)
      .then( _ => console.log('DB connected!'))
      .catch( error => console.log('DB Error : ', error))
  } catch (error) {
    console.log('Error starting server: ', error)
  }
}

start()
