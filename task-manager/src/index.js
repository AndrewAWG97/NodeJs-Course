
// Basic Express server setup
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// Import database connection
require('./db/mongoose') // Ensure database connection is established

// Import User model
const User = require('./models/user')
const Task = require('./models/task')
const UserRouter = require('./routers/user')

// Middleware to parse JSON bodies
app.use(express.json())

app.use(UserRouter)




// Start the server
app.listen(port, () => {
    console.log(`🚀 Server is up on port ${port}`)
})


