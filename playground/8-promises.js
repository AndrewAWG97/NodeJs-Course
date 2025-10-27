const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(a + b)
        }, 2000)
    })
}

add(1, 1)
    .then((sum) => {
        console.log('Sum:', sum)
        return add(sum, 5)
    }).then((sum2) => {
        console.log('Sum2:', sum2)
    })
    .catch((err) => {
        console.log('Error:', err)
    })