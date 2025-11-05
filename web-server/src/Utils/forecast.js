const request = require("request");

const weatherKey =  process.env.WEATHER_KEY;

const forecast = (lat, lon, callback) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric`;
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback("Unable to connect to server", undefined);
        }
        if (body.cod !== 200) {
            callback("Server internal error", undefined);
        } else {
            const {
                main: { temp: temperature },
                weather
            } = body;

            callback(undefined, {
                temperature,
                weatherMain: weather[0].main,
                weatherDescription: weather[0].description
            });
        }
    });
};

module.exports = forecast;
