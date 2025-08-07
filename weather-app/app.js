const request = require("request");

const location = "Karim Merhom egypt"; 


const getCoordinates = `https://us1.locationiq.com/v1/search?key=${LocationKey}&q=${encodeURIComponent(
    location
)}&format=json&limit=1`;

let lat;
let lon;

request({ url: getCoordinates, json: true }, (error, response) => {
    if (error) {
        console.log("Unable to connect to server");
    } else if (response.body.error) {
        console.log(response.body.error);
        return console.log("Unable to connect to geocoding service.");
    } else {
        lat = response.body[0].lat;
        lon = response.body[0].lon;
        const getWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric`;

        request({ url: getWeather, json: true }, (error, reponse) => {
            if (error) {
                console.log(error);
                console.log("Unable to connect to server");
            } else {
                if (!(response.body.cod != 200)) {
                    console.log("here")
                    console.log(reponse.body);
                } else {
                    console.log(reponse.body);
                    console.log(
                        `It's currently ${reponse.body.main.temp}°C in ${location}`
                    );
                }
            }
        });
    }
});


