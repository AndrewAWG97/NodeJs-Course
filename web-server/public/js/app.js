console.log("Client Side js file is loaded");

const weatherForm = document.querySelector('form');
const searchElement = document.querySelector('input');

// const messageOne = document.querySelector('#message-1'); // can remove later if not needed
// const messageTwo = document.querySelector('#message-2'); // can remove later if not needed

// New elements
const weatherCard = document.querySelector('#weather-result');
const locationElement = document.querySelector('#location');
const temperatureElement = document.querySelector('#temperature');
const descriptionElement = document.querySelector('#description');
const iconElement = document.querySelector('#weather-icon');

// messageOne.textContent = '';
// messageTwo.textContent = '';

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const location = searchElement.value;
    if (!location) {
        messageOne.textContent = "Please enter a location.";
        return;
    }

    locationElement.textContent = "Loading...";
    temperatureElement.textContent = "";
    descriptionElement.textContent = "";
    iconElement.src = "";
    weatherCard.classList.remove('hidden');

    fetch(`http://localhost:3000/weather?address=${encodeURIComponent(location)}`).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                console.error(data.error);
                locationElement.textContent = "Error";
                temperatureElement.textContent = "";
                descriptionElement.textContent = `⚠️ ${data.error}`;
                iconElement.src = "https://img.icons8.com/emoji/96/cross-mark-emoji.png"; // red X icon
                weatherCard.classList.remove('hidden');
            } else {
                console.log(data.location);
                // messageOne.textContent = '';
                // messageTwo.textContent = '';

                // Fill in weather card
                locationElement.textContent = data.location;
                temperatureElement.textContent = `🌡️ Temperature: ${data.forecastData.temperature}°C`;
                descriptionElement.textContent = `☁️ Condition: ${data.forecastData.weatherMain}`;

                // Optional: map weather condition to OpenWeather icons
                const weather = data.forecastData.weatherMain.toLowerCase();
                let iconUrl = "";
                if (weather.includes("cloud")) iconUrl = "https://img.icons8.com/fluency/96/cloud.png";
                else if (weather.includes("rain")) iconUrl = "https://img.icons8.com/fluency/96/rain.png";
                else if (weather.includes("clear")) iconUrl = "https://img.icons8.com/fluency/96/sun.png";
                else iconUrl = "https://img.icons8.com/fluency/96/partly-cloudy-day.png";

                iconElement.src = iconUrl;

                weatherCard.classList.remove('hidden'); // show card
            }
        });
    });
});
