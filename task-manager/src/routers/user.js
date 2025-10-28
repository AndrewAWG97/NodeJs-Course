// user.js

const express = require('express')

const User = require('../models/user')
const router = new express.Router()


// ====== USER ROUTES ======

// Post endpoint to create a new user
// We need to use async/await here because we are dealing with a database operation

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    await user.save()
    try {
        res.status(201).send(user)
    } catch (err) {
        res.status(400).send(err)
    }
})



// Get endpoint to get all users
router.get('/users', async (req, res) => {
    const users = await User.find({})
    try {
        res.send(users)
    } catch (err) {
        res.status(500).send(err)
    }
})

// Get endpoint to get user by ID

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    const user = await User.findById(_id)
    try {
        if (!user) return res.status(404).send()
        res.send(user)
    } catch (err) {
        res.status(500).send(err)
    }
})

//Update endpoint to get user by ID
router.patch('/users/:id', async (req, res) => {
    // Get the fields to be updated from the request body
    const updates = Object.keys(req.body)
    // Define which fields are allowed to be updated
    const allowedUpdates = ['name', 'email', 'age', 'password']
    // Check if all updates are valid
    // every method returns true if all elements pass the test
    
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    //new option to return the modified document rather than the original
    //runValidators to run schema validators on update
    // Proceed with the update
    try {
        // Make sure to go for middleware and validators
        const user = await User.findById(req.params.id)
        updates.forEach((update) => {
            user[update] = req.body[update] // Dynamically update fields
        })
        await user.save()
        
        if(!user) return res.status(404).send()
        res.send(user)

        // Alternative way (but won't run middleware and validators)
        // const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        // if (!updatedUser) return res.status(404).send()
        // res.send(updatedUser)
    } catch (err) {
        res.status(400).send(err)
    }
})



//Delete endpoint to delete user by ID
router.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        if (!deletedUser) return res.status(404).send()
        res.send(deletedUser)
    } catch (err) {
        res.status(500).send
    }
})


module.exports = router

