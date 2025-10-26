const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api')
    .then(() => console.log('✅ Database Connected'))
    .catch((err) => console.log('❌ Database Connection Error:', err))

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) throw new Error('Age must be a positive number')
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error('Invalid email')
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error("Cannot include the word password")
            }
        }
    }
})

// === TASK SCHEMA ===
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

// === MODELS ===
const User = mongoose.model('User', userSchema)
const Task = mongoose.model('Task', taskSchema)


// === TESTING ===

// const me = new User({
//     name: '  Andrew  ',
//     age: 28,
//     email: 'andrew@andrew.com', // invalid email → will throw error
//     password: 'Andrew@978'
// })

// me.save()
//     .then(() => console.log(me))
//     .catch(err => console.log('❌ Validation Error:', err.message))

// ✅ Create a new Task
const myTask = new Task({
    description: '       Learn Mongoose validations',
})

myTask.save()
    .then(() => {
        console.log('✅ Task saved successfully:')
        console.log(myTask)
    })
    .catch(err => console.log('❌ Task Error:', err.message))