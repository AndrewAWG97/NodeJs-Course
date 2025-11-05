// user.js

const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const router = new express.Router()


// ====== USER ROUTES ======

// Post endpoint to create a new user
// We need to use async/await here because we are dealing with a database operation
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).send({ error: 'User already exists with this email' })
        }
        res.status(400).send({ error: err.message })
    }
})


// Post endpoint for user login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (err) {
        res.status(400).send(err.message)
    }
})

// logout endpoint for user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send({ message: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send()
    }
})

// logout all sessions endpoint for user
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send({ message: 'Logged out from all sessions successfully' })
    } catch (err) {
        res.status(500).send()
    }
})

// now Request -> Middleware (auth) -> Route Handler
// Get endpoint to get profile of logged in user
router.get('/users/me', auth, async (req, res) => {
    // User is already authenticated and user data is attached to req.user by auth middleware
    res.send(req.user)
})

// Get endpoint to get all users (not used anymore)
// router.get('/users', auth ,async (req, res) => {
//     const users = await User.find({})
//     try {
//         res.send(users)
//     } catch (err) {
//         res.status(500).send(err)
//     }
// })



//Refactor the update endpoint to use auth middleware
router.patch('/users/me', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'email', 'age', 'password']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
        if(!isValidOperation){  
            return res.status(400).send({ error: 'Invalid updates!'})
        }
        req.user[updates] = req.body[updates]

        await req.user.save()
        res.send(req.user)
    } catch (err) {
        res.status(500).send(err)
    }

})


// Delete the use with auth middleware
router.delete('/users/me', auth, async (req, res) => {

    try {
        // Delete the authenticated user
        await req.user.deleteOne()
        res.send(req.user)
    } catch (err) {
        res.status(400).send(err)
    }
})

const upload = multer({
    dest: 'avatars', // Directory to store uploaded files
    limits:{
        fileSize: 1000000 // Set upload limit to 1MB
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('File type not accepted. Please upload an image'))
        }
        return cb(undefined, true)
        
    }
})

//POST Upload Avatar
router.post('/user/me/avatar', upload.single('avatar'),(req, res) => {
    res.send("Avatar Saved")
}, (err, req, res, next) => {
    res.status(400).send({error: err.message})
})


module.exports = router

