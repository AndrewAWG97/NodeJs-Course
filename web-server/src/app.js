const express = require('express')
const path = require('path')

console.log(__dirname)
console.log(__filename)

const publicDirectoryPath = path.join(__dirname, '../public')
// console.log(path.join(__dirname, '../public'))

const app = express()

app.use(express.static(publicDirectoryPath))


// app.get('', (req, res) => {
//     res.send('<h1>Weather<h1>')
// })

// app.get('/help', (req, res) => {
//     res.send([{
//         name: 'Andrew',
//     },
//     {
//         name: 'Joe Doe',
//     }])
// })
// app.get('/about', (req, res) => {
//     res.send('<h1>About Page<h1>')
// })

// app.get('/weather', (req, res) => {
//     res.send({
//         location:"Cairo, EG",
//         temp: 38
//     })
// })


//Start Server
app.listen(3000, () => {
    console.log('Server is up on port 3000')
})



