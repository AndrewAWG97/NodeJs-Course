//object property shorthand
const name = "Andrew"

const userAge = 28

const user = {
    name,
    age : userAge,
    location :"Egypt"
}

console.log(user)

//object destructuring

const product = {
    label : "Red notebook",
    price : 12,
    stock : 201,
    salePrice : undefined
}


const {label, stock, rating = 5} = product

console.log(label)
console.log(stock)
console.log(rating)
