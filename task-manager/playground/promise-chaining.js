require('../src/db/mongoose')

const User = require('../src/models/user')

//68ff378be4d170a840393596

// User.findByIdAndUpdate('68ff378be4d170a840393596', {age:40})
//     .then((user) => {
//         console.log(user)
//         return User.countDocuments({age:40})
//     }).then((result) => {
//         console.log(result)
//     }).catch((err) => {
//         console.log(err)
//     })


    const findByIdAndUpdate = async (id, age)=> {
        const user = await User.findByIdAndUpdate(id, {age: age})
        console.log(user)
        const count = await User.countDocuments({age: age})
        return count
    }

    findByIdAndUpdate('68ff3e2fb6fc292e3f0e791f', 20).then((count) => {
        console.log(count)
    }).catch((err) => {
        console.log(err)
    })