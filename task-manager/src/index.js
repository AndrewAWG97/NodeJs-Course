
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



// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () =>{
//     const task = await Task.findById('69075b9380aada0aed803e2c')
//     // 
//     // console.log(task.owner)
//     await task.populate('owner') //
//     console.log(task.owner)

//     const user = await User.findById('69075aba2aa6aab15231c9da')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }

// main()