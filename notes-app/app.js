const chalk = require("chalk");
const yargs = require("yargs");
const notes = require("./notes.js");

//customize yargs version
yargs.version("1.1.0");

// Create add command
yargs.command({
    command: "add",
    describe: "Add a new note",
    builder: {
        title: {
            describe: "Note Title",
            demandOption: true,
            type: 'string'
        },

        body: {
            describe: "Body of the note",
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        notes.addNote(argv.title, argv.body);
    },
});

//remove command
yargs.command({
    command: "remove",
    describe: "Remove a note",
    builder: {
        title: {
            describe: "Note Title",
            demandOption: true,
            type: "string"
        }
    },

    handler(argv) {
        console.log("Removing the note!");
        notes.removeNote(argv.title)
    },
});

//list command
yargs.command({
    command: "list",
    describe: "List all notes",
    handler() {
        console.log("Listing all notes");
    },
});

//read command
yargs.command({
    command: "read",
    describe: "read all notes",
    handler() {
        console.log("Reading note");
    },
});

// add note, remove note, list notes, read note

yargs.parse()
// console.log(yargs.argv);
