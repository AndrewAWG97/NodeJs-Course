const express = require('express')
const path = require('path')

console.log(__dirname)
console.log(__filename)

const publicDirectoryPath = path.join(__dirname, '../public')
const app = express()

app.set('view engine', 'hbs')
app.use(express.static(publicDirectoryPath))

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Andrew'
    })
})
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'help',
        name: 'Andrew'
    })
})

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Andrew'
    })
})


//Start Server
app.listen(3000, () => {
    console.log('Server is up on port 3000')
})



