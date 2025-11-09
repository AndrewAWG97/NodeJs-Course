const math = require('../src/math')

test('calulate tips', ()=>{
    const total = math.calculateTip(10, 0.3)
    expect(total).toBe(13)
})

// test('calulate tips', ()=>{
//     const total = math.calculateTip(10)
//     expect(total).toBe(12.5)
// })

// // 1. Test converting 32°F to 0°C
// test('Should convert 32 F to 0 C', () => {
//     const result = math.fahrenheitToCelsius(32)
//     expect(result).toBe(0) 
// })

// // 2. Test converting 0°C to 32°F
// test('Should convert 0 C to 32 F', () => {
//     const result = math.celsiusToFahrenheit(0)
//     expect(result).toBe(32)
// })


// // test('Async test demo', (done) => {
// //     setTimeout(() => {
// //         try {
// //             expect(1).toBe(1)
// //             done()
// //         } catch (error) {
// //             done(error) // ✅ tell Jest test failed
// //         }
// //     }, 2000)
// // })


// test('Should add 2 number',(done) => {
//     math.add(2,3).then((sum)=>{
//         expect(sum).toBe(5)
//         done()
//     })
// })


// test('should add 2 numbers async await', async ()=>{
//     const sum = await math.add(10,22)
//     expect(sum).toBe(32)
// })