
// Basic Express server setup
const express = require('express')
const app = express()
require('dotenv').config({ path: './config/dev.env', quiet: true })

const port = process.env.PORT

// Import database connection
require('./db/mongoose') // Ensure database connection is established

// Import User model
const UserRouter = require('./routers/user')
const TaskRouter = require('./routers/task')

app.use(express.json())

// Use imported routers
app.use(UserRouter)
app.use(TaskRouter)

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server is up on port ${port}`)
})

