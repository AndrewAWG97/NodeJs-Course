const add = async (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(a < 0 || b < 0) {
                return reject('Numbers must be non-negative')
            }
            resolve(a + b)
        }, 2000)
    })
}

//async allways returns a promise
// Promise is fulfilled with the value that is returned from the async function

//await operator can only be used inside an async function
// It makes JavaScript wait until that promise settles and returns its result.
const doWork = async () => {
    const sum = await add(1, 99)  // waits until the promise is resolved
    const sum2 = await add(sum, 50)
    const sum3 = await add(sum2, -5) // This will cause an error
    return sum3
}


doWork().then((result) => {
    console.log("Result:", result)
}).catch((e) => {
    console.log("Error:", e)
})

console.log("After calling doWork")