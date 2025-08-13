const geocode = require('./Utils/geocode')
const forecast = require('./Utils/forecast')

geocode('Boston', (error, data) => {
    console.log('Error', error)
    console.log('Data', data)
})

forecast(30.7088, 31.1545, (error, data) => {
  console.log('Error', error)
  console.log('Data', data)
})
