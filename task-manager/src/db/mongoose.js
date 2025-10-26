const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api')
  .then(() => console.log('✅ Database Connected'))
  .catch((err) => console.log('❌ Database Connection Error:', err))

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true,        // Removes extra spaces (e.g. "  Andrew " → "Andrew")
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number')
      }
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,        // Removes whitespace before/after
    lowercase: true,   // Converts to lowercase automatically
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Not a valid email')
      }
    }
  }
})

// Example: email missing '@' → will fail validation
const me = new User({
  name: '   Andrew   ',
  age: 28,
  email: '   ANDREW.COM   '
})

me.save()
  .then(() => {
    console.log(me)
  })
  .catch((error) => {
    console.log('❌ Validation Error:', error.message)
  })
