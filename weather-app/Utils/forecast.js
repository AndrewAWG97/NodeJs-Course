const request = require("request");

const weatherKey = "dba6b0810bc0f2e435a1da229cd57af9";

const forecast = (lat, lon, callback) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric`;
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback("Unable to connect to server", undefined);
        }
        if (body.cod !== 200) {
            callback("Server internal error", undefined);
        } else {
            const { temp: temperature } = body.main;
            callback(undefined, {
                temperature,
            });
        }
    });
};

module.exports = forecast;
