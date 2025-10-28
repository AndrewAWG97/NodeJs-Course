const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})


taskSchema.pre('save', async function (next) {
    const task = this
    console.log('Just before saving task!')
    // if we didn't call next we will be stuck here forever
    next()
})

// === MODELS ===
const Task = mongoose.model('Task', taskSchema)

module.exports = Task