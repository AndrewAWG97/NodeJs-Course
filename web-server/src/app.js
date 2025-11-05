// Load core and external modules
const express = require('express')    // Import Express framework
const path = require('path')          // Import Node.js path module for handling file paths
const hbs = require('hbs')

require('dotenv').config()

const geocode = require('./Utils/geocode')
const forecast = require('./Utils/forecast')


// Debugging: log current directory and file name
// console.log(__dirname)   // The absolute path of the current directory (where this file is located)
// console.log(__filename)  // The absolute path of this file (app.js)

// Define paths for Express configuration
const publicDirectoryPath = path.join(__dirname, '../public')   // Path to serve static files (HTML, CSS, JS, images)
const viewsPath = path.join(__dirname, '../templates/views')          // Path where Handlebars (.hbs) view templates are stored
const partialPath = path.join(__dirname, '../templates/partials')


// Initialize Express application
const app = express()

// Set Handlebars as the view engine
app.set('view engine', 'hbs')

// Tell Express to look for views (templates) in the "templates" folder instead of default "views"
app.set('views', viewsPath)

hbs.registerPartials(partialPath)

// Setup static directory to serve (for static files like HTML, CSS, JS, images in /public)
app.use(express.static(publicDirectoryPath))

// ------------------- Routes -------------------

// Render "about.hbs" when user visits /about
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Andrew Ashraf'
    })
})

// Render "help.hbs" when user visits /help
app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text',
        title: 'Help',
        name: 'Andrew Ashraf'
    })
})

// Render "index.hbs" when user visits /
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Andrew Ashraf'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Please provide an address'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error: error
            })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error: error
                })
            }
            console.log(location)
            console.log(forecastData)
            res.send({
                address: req.query.address,
                location: location,
                forecastData: forecastData
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search'
        })
    }
    console.log(req.query)

    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help : Article not found',
        errorMsg: 'Page not found!',
        name: 'Andrew'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Page not Found',
        errorMsg: 'Page not found!',
        name: 'Andrew Ashraf'
    })
})


// ------------------- Start the server -------------------
const port = process.env.PORT || 8085
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})
