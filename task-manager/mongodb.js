const { MongoClient, ObjectId } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL)
    .then(client => {
        console.log("✅ Connected to MongoDB");
        const db = client.db(databaseName);

        const tasks = [
            // { description: "Install mongodb", completed: true },
            // { description: "Test mongodb connection", completed: true },
            // { description: "Run mead task", completed: false },
            { description: "Test new field", completed: true, newField: "What is going to happen" },
        ];

        return db.collection('Task Collections')
            .insertMany(tasks)
            .then(() => tasks); // return full array of inserted documents
    })
    .then(fullDocuments => {
        console.log("🎉 Full inserted documents:", fullDocuments);
    })
    .catch(error => {
        console.log("❌ Error:", error);
    });
