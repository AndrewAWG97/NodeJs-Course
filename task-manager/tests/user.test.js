const request = require('supertest')
const app = require('../src/app') // adjust path if needed
const User = require('../src/models/user') // model to check DB
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userOneID = new mongoose.Types.ObjectId()

const userOne = {
    _id : userOneID,
    name : 'Freddy',
    email : 'freddy@example.com',
    password : 'freddy@123',
    tokens : [{
        token : jwt.sign({_id: userOneID}, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URL)

    await User.deleteMany()
    await new User(userOne).save()
    // console.log("before Each")
})

afterEach(async () => {
    await mongoose.connection.close()
})

jest.mock('@sendgrid/mail', () => ({
    setApiKey: jest.fn(),
    send: jest.fn().mockResolvedValue([])
}))

test('Should signup a new user', async () => {
    const response = await request(app)
        .post('/users') // your signup endpoint
        .send({
            name: 'Andrew Ashraf',
            email: 'andrew@example.com',
            password: 'MyPass777!'
        })
        .expect(201) // Expect status 201 Created
})


test('Should login existing user', async () =>{
    await request(app).post('/users/login')
    .send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Should not login existing user', async () =>{
    await request(app).post('/users/login')
    .send({
        email: 'email@email.com',
        password: 'password@123'
    }).expect(400)
})


test('Should get profile for user', async ()=>{
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)
    .send()
})

test('Should not get profile for user', async ()=>{
    await request(app)
    .get('/users/me')
    .expect(401)
    .send()
})

test('Should Delete profile for user', async ()=>{
    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)
    .send()
})

test('Should not Delete profile for user', async ()=>{
    await request(app)
    .delete('/users/me')
    .expect(401)
    .send()
})