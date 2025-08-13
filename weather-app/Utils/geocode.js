request = require('request')

const LocationKey = "pk.";

const geocode = (address, callback) => {
    const url = `https://us1.locationiq.com/v1/search?key=${LocationKey}&q=${encodeURIComponent(address)}&format=json&limit=1
`
    request({ url: url, json: true }, (error, response) => {
        if (error) {
            callback('Unable to connect to Location Service!', undefined)
        } else if (response.body.error) {
            callback(`Unable to find Location! Try Another ..`, undefined)
        } else {
            if (response.body.length === 0) {
                callback(`Unable to find location`, undefined)
            } else {
                callback(undefined, {
                    latitude : response.body[0].lat,
                    longitude : response.body[0].lon,
                    location : response.body[0].display_name
                })
            }
        }
    })
}

module.exports = geocode