const fs = require("fs");
// const book = {
//     title: "Wild at Heat",
//     author: "John"
// }

// const bookJSON = JSON.stringify(book)

// fs.writeFileSync("1-json.json", bookJSON)

// const dataBuffer = fs.readFileSync("1-json.json");
// const dataJSON = dataBuffer.toString();
// const data = JSON.parse(dataJSON);
// console.log(data.title);

const loadedData = fs.readFileSync("1-json.json")
const dataJSON = loadedData.toString()
const parsedData = JSON.parse(dataJSON) // to object
console.log(parsedData)

// const name = "Nouni"
// const planet = "Earth"
// const age = "26"

parsedData.name = "Andrew"
parsedData.planet = "Earth"
parsedData.age = "28"

console.log("After Change: ")
console.log(parsedData)

const toWriteData = JSON.stringify(parsedData) // to JSON
console.log(toWriteData)



fs.writeFileSync("1-json.json", toWriteData)