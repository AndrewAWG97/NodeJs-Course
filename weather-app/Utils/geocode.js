request = require('request')

const LocationKey = "pk.07aa2bd8eae426c543e2e452aa3f7557";

const geocode = (address, callback) => {
    const url = `https://us1.locationiq.com/v1/search?key=${LocationKey}&q=${encodeURIComponent(address)}&format=json&limit=1
`
    request({ url, json: true }, (error, { body } = {}) => {
        if (error) {
            callback('Unable to connect to Location Service!', undefined)
        } else if (body.error) {
            callback(`Unable to find Location! Try Another ..`, undefined)
        } else {
            if (body.length === 0) {
                callback(`Unable to find location`, undefined)
            } else {
                const { lat: latitude, lon: longitude, display_name: location } = body[0]
                callback(undefined, {
                    latitude,
                    longitude,
                    location
                })
            }
        }
    })
}

module.exports = geocode