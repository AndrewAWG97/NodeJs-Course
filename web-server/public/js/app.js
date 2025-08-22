console.log("Client Side js file is loaded")



const weatherForm = document.querySelector('form')
const searchElement = document.querySelector('input')

const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')

messageOne.textContent = ''
messageTwo.textContent = ''

weatherForm.addEventListener('submit', (e) => {

    e.preventDefault()
    messageOne.textContent = ''
    messageTwo.textContent = ''
    const location = searchElement.value
    console.log(location)
    messageOne.textContent = 'Loading ...'
    fetch(`http://localhost:3000/weather?address=${encodeURIComponent(location)}`).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                console.log(data.error)
                messageOne.textContent = data.error
            } else {
                console.log(data.location)
                messageOne.textContent = data.location
                console.log(data.forecastData.temperature)
                messageTwo.textContent = "Temperature is  " + data.forecastData.temperature + " Description : " + data.forecastData.weatherMain
                console.log(data.forecastData.weatherMain)
            }
        })
    })
})