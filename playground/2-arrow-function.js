// const square = function(x){
//     return x
// }

// const square = (x) => {
//     return x
// }

// const square = (x) =>{
//     return x * x
// }

// const square = (x) => x * x //only for one line functions

// console.log(square(8))

// const event = {
//     name : "Birthday Party",
//     guestList : ['Andrew' , 'King', 'Kong'],
//     printGuestList() {
//         console.log("Guest List for " + this.name); 
//         this.guestList.forEach((guest) => {
//             console.log(guest + " is attending " + this.name)
//         })
//     }
// }

// event.printGuestList()



// const numbers = [1, 2, 3, 4, 5, 6];

// const even = numbers.filter(function(num){
//     return num % 2 === 0;
// });

// console.log(even); // [2, 4, 6]

// regular
// const add = function(a, b) {
//     return a + b;
// }

// const addArrow = (a,b) => a+b; 

// console.log(add(1,2))
// console.log(addArrow(1,2))

// const greet = function(name) {
//     return "Hello, " + name;
// }

// const greetArrow = (name)=> "Hello, " + name;

// console.log(greet("Andrew"))
// console.log(greetArrow("Ihab"))

// const people = [
//     { name: "Andrew", age: 25, role: "admin" },
//     { name: "Sarah", age: 30, role: "editor" },
//     { name: "Tom", age: 18, role: "viewer" },
//     { name: "Mina", age: 40, role: "admin" }
// ];

// const oldPeople = people.filter((guy) => (guy.age > 20) && (guy.role ==="admin") )
// console.log(oldPeople)

const products = [
    { name: "Laptop", specs: { ram: 16, storage: 512 } },
    { name: "Phone", specs: { ram: 4, storage: 128 } },
    { name: "Tablet", specs: { ram: 8, storage: 256 } }
];


const BigRAM = products.filter((product) => (product.specs.ram >= 8))

console.log(BigRAM)


const items = [
  { name: "pen", price: 5 },
  { name: "book", price: 20 },
  { name: "notebook", price: 15 },
  { name: "eraser", price: 3 }
];

const filtred = items.filter((item) => (item.name.length > 4) && (item.price < 18))
console.log(filtred)