
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

const pet = {
    name: 'Hal'
}
pet.toJSON = function () {
    console.log(this)
    return this
}

console.log(JSON.stringify(pet))
// console.log(pet) // Express calls toJSON automatically when sending response

