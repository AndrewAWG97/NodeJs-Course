require('../src/db/mongoose')

const User = require('../src/models/user')

//68ff378be4d170a840393596

User.findByIdAndUpdate('68ff378be4d170a840393596', {age:40})
    .then((user) => {
        console.log(user)
        return User.countDocuments({age:40})
    }).then((result) => {
        console.log(result)
    }).catch((err) => {
        console.log(err)
    }).finally(() => {
        User.find({}).then((users) => {
            console.log(users)
            process.exit()
        })
    })


