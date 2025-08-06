const request = require("request")

const key = "e922684c4c784f36895140459250608"
const city = "cairo"

const url = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&aqi=no`
request({url: url, json: true}, (error, reponse)=>{
    // const data = JSON.parse(reponse.body)
    // console.log(data.location.name)
    // console.log(data.current.temp_c)
    // console.log(reponse.body.current)
    console.log("It's currently "+ reponse.body.current.temp_c + "°C")
})

