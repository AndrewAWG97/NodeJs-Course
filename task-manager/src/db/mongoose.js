const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => console.log('✅ Database Connected'))
    .catch((err) => console.log('❌ Database Connection Error:', err))



