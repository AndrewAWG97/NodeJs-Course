const { default: chalk } = require("chalk");
const fs = require("fs");


const addNote = (title, body) => {
  const notes = loadNote();

  // const duplicateNotes = notes.filter((note) => note.title === title);
  
  // search till it find the note
  const duplicateNote = notes.find((note) => note.title === title)

  if (!duplicateNote) {
    notes.push({
      title: title,
      body: body,
    });
    saveNotes(notes);
    console.log(chalk.green.bold("New Note Added"));
  } else {
    console.log(chalk.bold.red("Note Title already exist"));
  }
};

const saveNotes = (notes) => {
  const dataJSON = JSON.stringify(notes);
  fs.writeFileSync("notes.json", dataJSON);
};

const loadNote = () => {
  try {
    const dataBuffer = fs.readFileSync("notes.json");
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

const removeNote = (title) => {
  console.log("loading Notes to remove the note");
  const notes = loadNote();

  // Arrow
  const notesToKeep = notes.filter((note) => note.title !== title);

  // // 1st Method
  // const notesToKeep = notes.filter(function (note) {
  //     return note.title !== title
  // })

  saveNotes(notesToKeep);

  if (notes.length > notesToKeep.length) {
    console.log(chalk.green.bold("Note Removed"));
  } else {
    console.log(chalk.bold.red("No Notes to Be Removed !!"));
  }

  // 2nd Method
  // const duplicateNotes = notes.filter(function (note) {
  //     return note.title === title
  // })

  // if (duplicateNotes.length !== 0) {
  //     console.log("Note Found")
  //     const index = notes.findIndex(function (note) {
  //         console.log("note " + (JSON.stringify(note)))
  //         return note.title === title;
  //     });
  //     console.log(index)
  //     notes.splice(index, 1)
  //     saveNotes(notes)
  // } else {
  //     console.log("Note does not exist")
  // }
};


const listNotes = () => {
  console.log(chalk.bold.cyan("Your Notes"))
  const notes = loadNote();

  notes.forEach((note) => {
    console.log(note.title)
  });

}

const readNote = (title) => {
  const notes = loadNote()
  const Note = notes.find((note) => note.title === title)

  if(Note){
    console.log("Title : " + Note.title)
    console.log("Body : " + Note.body)

  }else{
    console.log(chalk.bold.red("Note does not exit!"))
  }
}



module.exports = {
  getNotes: getNotes,
  addNote: addNote,
  removeNote: removeNote,
  listNotes: listNotes,
  readNote: readNote
};
