const request = require('supertest')
const mongoose = require('mongoose')  
const app = require('../src/app')
const User = require('../src/models/user')
const { userOne, userOneID, setupDatabase } = require('./fixtures/db')

jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn().mockResolvedValue([])
}))

beforeEach(setupDatabase)


afterAll(async () => {
  await mongoose.connection.close()
})


test('Should signup a new user', async () => {
    const response = await request(app)
        .post('/users') // your signup endpoint
        .send({
            name: 'Peter Ashraf',
            email: 'peter@example.com',
            password: 'MyPass777!'
        })
        .expect(201) // Expect status 201 Created
    
        // Assert that the data base was changed correctly
        const user = await User.findById(response.body.user._id)
        expect(user).not.toBeNull()
        
        // Assertions about the response 
        expect(response.body).toMatchObject({
            user: {
                name: 'Peter Ashraf',
                email: 'peter@example.com'
            },
            token: user.tokens[0].token
        })

        expect(user.password).not.toBe('MyPass777!')
})


test('Should login existing user', async () =>{
    const response = await request(app).post('/users/login')
    .send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneID)

    expect(response.body.token).toBe(user.tokens[1].token)
    
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
    const user = await User.findById(userOneID)
    expect(user).toBeNull()
})

test('Should not Delete profile for user', async ()=>{
    await request(app)
    .delete('/users/me')
    .expect(401)
    .send()
})

test('Should upload an avatar image', async () =>{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token} `)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

        const user = await User.findById(userOneID)
        expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user field', async () => {
     await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token} `)
        .send({
            age : 10
        })
        .expect(200)
        
        const user = await User.findById(userOneID)
        expect(user.age).toBe(10)

})

test('Should update valid user field', async () => {
     await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token} `)
        .send({
            location : 'cairo'
        })
        .expect(400)
    })