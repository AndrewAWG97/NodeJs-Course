// src/app.js
const path = require('path')
const express = require('express')

// ✅ Load the correct .env before anything else
const envFile = process.env.NODE_ENV === 'test'
  ? path.resolve(__dirname, '../config/test.env')
  : path.resolve(__dirname, '../config/dev.env')

require('dotenv').config({ path: envFile })
// console.log('Loaded ENV from:', envFile)
// console.log('MONGODB_URL:', process.env.MONGODB_URL) // <-- should print correctly

// ✅ Now safely connect to MongoDB
require('./db/mongoose')

// Routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app
