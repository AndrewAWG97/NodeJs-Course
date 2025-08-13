const request = require("request");

const weatherKey = "";

const forecast = (lat, lon, callback) =>{
    const getWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric`;
    request({ url: getWeather, json: true }, (error, response) => {
            if (error) {
                // console.log(error);
                // console.log("Unable to connect to server");
                callback('Unable to connect to server', undefined)
            } else {
                if (!(response.body.cod === 200)) {
                    console.log(response.body);
                    callback('Server internal error', undefined)
                } else {
                    // console.log(response.body);
                    callback(undefined, {
                        CurrentTemp : response.body.main.temp,

                    })
                }
            }
        });
}

module.exports = forecast