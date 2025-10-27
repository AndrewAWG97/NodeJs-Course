const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

// ====== TASK ROUTES ======

// Post endpoint to create a new task
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    await task.save()
    try {
        res.status(201).send(task)
    } catch (err) {
        res.status(400).send(err)
    }
})

// Get endpoint to get all tasks
router.get('/tasks', async (req, res) => {
    const tasks = await Task.find({})
    try {
        res.send(tasks)
    } catch (err) {
        res.status(500).send(err)
    }
})  
   
// Get endpoint to get task by ID
router.get('/tasks/:id', async(req, res) => {
    const _id = req.params.id
    const task = await Task.findById(_id)
    try {
        if (!task) return res.status(404).send()
        res.send(task)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.patch('/tasks/:id', async (req, res) => {
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
        const updatedTaskbyId = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!updatedTaskbyId) return res.status(404).send()
        res.send(updatedTaskbyId)
    } catch (err) {
        res.status(400).send(err)
    }
})

//delete endpoint to delete task by ID
router.delete('/tasks/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id)
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