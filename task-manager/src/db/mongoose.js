const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api')
  .then(() => console.log('✅ Database Connected'))
  .catch((err) => console.log('❌ Database Connection Error:', err))


const User = mongoose.model('User', {
    name: {
        type: String
    },
    age: {
        type : Number
    }
})

const me = new User({
    name: "Andrew",
    age: "andrew"
})

me.save().then(() =>{
    console.log(me)
})
.catch((error)=> {
    console.log(error)
})