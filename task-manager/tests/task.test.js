const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')
const mongoose = require('mongoose')  // ✅ Missing import fixed

const { userOne, userOneID, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

afterAll(async () => {
    await mongoose.connection.close()
})


test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`) // login as userOne
        .send({
            description: 'Finish Node.js testing section'
        })
        .expect(201)
        
    // Validate that the task was created in the database
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()

    // Assert that the task has default "completed: false"
    expect(task.completed).toBe(false)

    // Assert that the owner is the same user
    expect(task.owner.toString()).toBe(userOneID.toString())
})