const fs = require('fs')

const getNotes = function () {
    return 'Your notes...';
};


const addNote = function (title, body) {
    const notes = loadNote()

    const duplicateNotes = notes.filter(function (note) {
        return note.title === title
    })

    console.log(duplicateNotes.length)
    if (duplicateNotes.length === 0) {
        notes.push({
            title: title,
            body: body
        })
        saveNotes(notes)
        console.log("New Note Added")
    }else{
        console.log("Note Title Taken")
    }

}

const saveNotes = function (notes) {
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync('notes.json', dataJSON)
}

const loadNote = function () {
    try {
        const dataBuffer = fs.readFileSync('notes.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        return []
    }
}

module.exports = {
    getNotes: getNotes,
    addNote: addNote
}
