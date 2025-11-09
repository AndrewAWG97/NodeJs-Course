// src/db/mongoose.js
const mongoose = require('mongoose')

// Debug log: see what Mongoose sees
// console.log('Connecting to MongoDB:', process.env.MONGODB_URL)

if (!process.env.MONGODB_URL) {
  throw new Error('MONGODB_URL is not defined! Check your .env loading order.')
}

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('✅ Database Connected'))
  .catch((err) => console.log('❌ Database Connection Error:', err))
