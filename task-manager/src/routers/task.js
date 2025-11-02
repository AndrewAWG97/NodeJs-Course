const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()


// ====== TASK ROUTES ======

// Post endpoint to create a new task
router.post('/tasks', auth, async (req, res) => {

    const task = new Task({ // Create a new task instance
        ...req.body,
        owner: req.user._id // adding owner field to the task
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (err) {
        res.status(400).send(err)
    }
})

// GET endpoint to get all tasks   // GET /taslks?completed=true or false
router.get('/tasks', auth, async (req, res) => {
    // const tasks = await Task.find({owner: req.user._id})
    const match = {}

    if(req.query.completed){
        match.completed = (req.query.completed === 'true')
    }
    
    try {
        await req.user.populate({
            path: 'tasks',
            match
        })
        res.send(req.user.tasks)
    } catch (err) {
        res.status(500).send(err)
    }
})

// Get endpoint to get task by ID
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        //find task by id and owner id
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) return res.status(404).send()
        res.send(task)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    // get the fields to be updated from the request body
    const updates = Object.keys(req.body)
    //define which fields are allowed to be updated
    const allowedUpdate = 'completed'

    //Check if all updates are valid
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    // New : option to return the modified document rather than the original
    // runValidators to run schema validators on update
    // Proceed with the update
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) return res.status(404).send()

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
        // const updatedTaskbyId = task
        // const updatedTaskbyId = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    } catch (err) {
        res.status(400).send(err)
    }
})

//delete endpoint to delete task by ID
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        //if no task found send 404 and maessage no user found
        if (!deletedTask) return res.status(404).send()
        //if task found send deleted task back
        res.send(deletedTask)
    }
    catch (err) {
        res.status(500).send()
    }
})

module.exports = router