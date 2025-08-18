const express = require('express')
const path = require('path')

console.log(__dirname)
console.log(__filename)

const publicDirectoryPath = path.join(__dirname, '../public')
const app = express()

app.set('view engine', 'hbs')
app.use(express.static(publicDirectoryPath))


//Start Server
app.listen(3000, () => {
    console.log('Server is up on port 3000')
})



