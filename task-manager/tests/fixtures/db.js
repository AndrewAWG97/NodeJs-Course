const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')  // ✅ Missing import fixed

const userOneID = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneID,
  name: 'Freddy',
  email: 'freddy@example.com',
  password: 'freddy@123',
  tokens: [
    {
      token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET)
    }
  ]
}

const setupDatabase = async () => {
  await User.deleteMany()
  await new User(userOne).save()
}

module.exports = {
  userOne,
  userOneID,
  setupDatabase
}
