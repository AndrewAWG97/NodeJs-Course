// setTimeout(() => {
//     console.log("2 seconds passed")
// }, 2000)


// const names = ["Andrew", "Jen", "Jess"]

// const shortNames = names.filter((name) => {
//     return name.length <= 4
// })

// const geocode = (address, callback) => {
//     setTimeout(() => {
//         const data = {
//             lat: 30.454,
//             lon: 31.154,
//         }
//         callback(data)
//     }, 2000)
// }

// data = geocode("Cairo", (king) => {
//     console.log(king)
// })


const add = (a, b, callback) => {
    setTimeout(() => {
        
        callback(a + b)
    }, 2000)
}


add(5, 4, (sum) => {
    console.log(sum) // Should print: 9
})