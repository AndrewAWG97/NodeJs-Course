
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

// Use imported routers
app.use(UserRouter)
app.use(TaskRouter)

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server is up on port ${port}`)
})

// const bcrypt = require('bcryptjs')

// const myFunction = async () => {
//     const password = 'Andrew'
//     const hashedPassword = await bcrypt.hash(password, 8)
//     console.log('Password:', password)
//     console.log('Hashed Password:', hashedPassword)

//     const isMatch = await bcrypt.compare('Andrew', hashedPassword)
//     console.log('Do they match?', isMatch)
// }

// myFunction()

