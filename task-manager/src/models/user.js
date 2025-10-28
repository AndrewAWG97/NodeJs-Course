
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')





const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            //Validate if name contains only letters and spaces
            if (validator.isAlpha(value.replace(/ /g, '')) === false) {
                throw new Error('Name must contain only letters and spaces')
            }
        }
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
        unique: true,
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
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Cannot include the word password")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//method to generate auth token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thismynewcourse', { expiresIn: '1 hours' })

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}


// Static method to find user by credentials
userSchema.statics.findByCredentials = async function (email, password) {
    const user = await this.findOne({ email }) // 'this' refers to the model
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Middleware to hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    // if we didn't call next we will be stuck here forever
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User