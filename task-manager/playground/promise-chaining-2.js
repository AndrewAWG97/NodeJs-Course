// Load Mongoose configuration and models
require('../src/db/mongoose')
const Task = require('../src/models/task')

//Remove a task by ID and then count the remaining tasks

Task.findByIdAndDelete('68ff1f20122ee48aaaf37780')
    .then((deletedTask) => {
        if(!deletedTask) {
            throw new Error('Task not found')
        }
        console.log('Deleted Task:', deletedTask)
        return Task.countDocuments({})
    })
    .then((count) => {
        console.log('Remaining Tasks Count:', count)
    })
    .catch((err) => {
        console.log('Error:', err)
    })
    .finally(() => {
        // Exit the process after operations complete
        process.exit()
    })  