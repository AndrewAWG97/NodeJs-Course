//
// Goal: Create method to get incomplete tasks
//
// 1. Define getTasksToDo method
// 2. Use filter to to return just the incompleted tasks (arrow function)
// 3. Test your work by running the script

const tasks = {
    tasks: [{
        text: 'Grocery shopping',
        completed: true
    }, {
        text: 'Clean yard',
        completed: false
    }, {
        text: 'Film course',
        completed: false
    }],

    getTasksToDo() {
       return this.tasks.filter((task) => !task.completed)
    }

}

console.log(tasks.getTasksToDo())

// const library = {
//   books: [
//     { title: "Atomic Habits", read: true },
//     { title: "Deep Work", read: false },
//     { title: "Clean Code", read: false }
//   ],

//   getUnreadBooks(){
//     const unreadBooks = this.books.filter((book) => !book.read)
//     const titles = unreadBooks.map((book) => book.title)
//     console.log(unreadBooks)
//     console.log(titles)
//   }
  
//   // You’ll define your method here
// };

// library.getUnreadBooks()