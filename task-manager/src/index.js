const app = require('./app.js')

const port = process.env.PORT

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server is up on port ${port}`)
})

