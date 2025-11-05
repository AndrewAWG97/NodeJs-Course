
// Basic Express server setup
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// Import database connection
require('./db/mongoose') // Ensure database connection is established

// Import User model
const UserRouter = require('./routers/user')
const TaskRouter = require('./routers/task')

// file upload setup (commented out for now)
const multer = require('multer')

const upload = multer({
    dest: 'images', // Directory to store uploaded files
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(doc|docx)$/)) { // using regular expressions
            return cb(new Error('File must be a word document'))

        }
        // cb(new Error('File must be a pdf'))
        cb(undefined, true) // Accpet the file
        // cb(undefined, false) //silently reject the code
    }
})


app.post('/upload',upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next) => { // imp to provide all 4 arg that express knows that this fn handles errors
    res.status(400).send({error: error.message})
})


app.use(express.json())


// Use imported routers
app.use(UserRouter)
app.use(TaskRouter)

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server is up on port ${port}`)
})



