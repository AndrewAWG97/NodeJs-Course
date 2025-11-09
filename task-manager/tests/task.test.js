const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
  userOne,
  userOneID,
  userTwo,
  userTwoID,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase
} = require('./fixtures/db')

// Run before each test to reset DB
beforeEach(setupDatabase)
afterAll(async () => await mongoose.connection.close())

// ============ CREATE TASK ============
test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'New test task'
    })
    .expect(201)

  // Verify task is in DB
  const task = await Task.findById(response.body._id)
  expect(task).not.toBeNull()
  expect(task.completed).toBe(false)
  expect(task.owner.toString()).toBe(userOneID.toString())
})

// ============ FETCH TASKS ============
test('Should fetch all tasks for userOne', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  // userOne has 2 seeded tasks
  expect(response.body.length).toBe(2)

  // Verify ownership
  response.body.forEach(task => {
    expect(task.owner).toBe(userOneID.toString())
  })
})

test('Should not fetch tasks for unauthenticated user', async () => {
  await request(app)
    .get('/tasks')
    .send()
    .expect(401)
})

// ============ FETCH TASK BY ID ============
test('Should fetch a task by ID if owned by user', async () => {
  const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  expect(response.body._id).toBe(taskOne._id.toString())
})

test('Should not fetch task by ID if not owner', async () => {
  await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)
})

// ============ UPDATE TASK ============
test('Should update user task', async () => {
  const response = await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      completed: true
    })
    .expect(200)

  const task = await Task.findById(taskOne._id)
  expect(task.completed).toBe(true)
})

test('Should not update task if unauthenticated', async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .send({ completed: true })
    .expect(401)
})

test('Should not update other user’s task', async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({ completed: true })
    .expect(404)
})

test('Should reject invalid update field', async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ title: 'Invalid field' })
    .expect(400)
})

// ============ DELETE TASK ============
test('Should delete user task', async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  const task = await Task.findById(taskOne._id)
  expect(task).toBeNull()
})

test('Should not delete task of another user', async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

  const task = await Task.findById(taskOne._id)
  expect(task).not.toBeNull()
})

test('Should not delete task if unauthenticated', async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .send()
    .expect(401)
})

// ============ FILTER, PAGINATION & SORT ============
test('Should fetch only completed tasks', async () => {
  const response = await request(app)
    .get('/tasks?completed=true')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  expect(response.body.length).toBe(1)
  expect(response.body[0].completed).toBe(true)
})

test('Should fetch only incomplete tasks', async () => {
  const response = await request(app)
    .get('/tasks?completed=false')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  expect(response.body.length).toBe(1)
  expect(response.body[0].completed).toBe(false)
})

test('Should fetch paginated tasks', async () => {
  const response = await request(app)
    .get('/tasks?limit=1&skip=1')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  expect(response.body.length).toBe(1)
})

test('Should sort tasks by creation date descending', async () => {
  const response = await request(app)
    .get('/tasks?sortBy=createdAt:desc')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  expect(response.body[0].createdAt).toBeDefined()
})
