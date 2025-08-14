const https = require('https')

const LocationKey = "pk.07aa2bd8eae426c543e2e452aa3f7557";
const url = `https://us1.locationiq.com/v1/search?key=${LocationKey}&q=cairo&format=json&limit=1`

const request = https.request(url, (response) => {

    let data = ''
    
    response.on('data', (chunk) =>{
        data = data + chunk.toString()
    })

    response.on('end', () =>{
        const body = JSON.parse(data)
        console.log(body);
    })
})

request.on('error', (error)=>{
    console.log(error)
})
request.end()