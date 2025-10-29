
// Basic Express server setup
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// Import database connection
require('./db/mongoose') // Ensure database connection is established

// Import User model
const UserRouter = require('./routers/user')
const TaskRouter = require('./routers/task')

// Middleware to parse JSON bodies
app.use(express.json())

// app.use((req, res, next) => {
//     if (req.method) {
//         res. status(503).send('Site is under maintenance')
//     }    
// }) 


// Use imported routers
app.use(UserRouter)
app.use(TaskRouter)

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server is up on port ${port}`)
})





// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//   const token = jwt.sign(
//     { _id: 'abc123' },
//     'thismynewcourse',
//     { expiresIn: '1 minutes' }
//   )

//   console.log('Token:', token)

//   jwt.verify(token, 'thismynewcourse', (err, decoded) => {
//     if (err) {
//       console.log('Error verifying token:', err)
//     } else {
//       console.log('Decoded payload:', decoded)

//       const expiryDate = new Date(decoded.exp * 1000)
//       console.log('Token expires at:', expiryDate.toLocaleString())
//     }
//   })
// }


// myFunction()

