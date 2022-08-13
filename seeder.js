const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');

// Bringing in dotenv b/c we want access to the MONGO_URI
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Educator = require('./models/Educator');
const Student = require('./models/Student');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);


// ** READ EDUCATORS JSON FILE:
// .parse() The JSON.parse() method parses a JSON string, constructing the 
// JavaScript value or object described by the string.
const educators = JSON.parse(
    // fs.readFileSync(path[, options]):
    // path returns the contents of the path.
    // options encoding returns a string if specified (our case 'utf-8), 
    // otherwise it returns a buffer.

    // Node.js --> __dirname: It is a local variable that returns the directory name of the current module. It returns the folder path of the current JavaScript file. It returns the directory name of the directory containing the source code file. *It is local to each module.

    // Use 'utf-8' when you don't need flags

    fs.readFileSync(`${__dirname}/data/educators.json`, 'utf-8')
    );

const students = JSON.parse(

    fs.readFileSync(`${__dirname}/data/students.json`, 'utf-8')
    
    );

// ** IMPORT INTO DB
const importData = async () => {
    try{
        // Not being referenced to a variable b/c
        // we are not going to need to access it later
        // it's just going to run 
        await Educator.create(educators);
        await Student.create(students);
        console.log('--> --> Data imported <-- <--'.brightYellow.bold.italic.inverse);

        // The process core module provides a handy method that allows you to programmatically exit from a Node.js program: process.exit().
        // When Node.js runs this line, the process is immediately forced to terminate.
        // This means that any callback that's pending, any network request still being sent, any filesystem access, or processes writing to stdout or stderr - all is going to be ungracefully terminated right away.
        // If this is fine for you, you can pass an integer that signals the operating system the exit code:
        process.exit();
    } catch (err){
        console.log(err);
    }
}


// ** DELETE FROM DB
const deleteData = async () => {
    try{
        await Educator.deleteMany();
        await Student.deleteMany();
        console.log('--> --> Data dee-stroyed <-- <--'.bgBlack.brightRed.underline);
        process.exit();
    } catch (err){
        console.log(err);
    }
}

// sup w/ this third index/2 in the array being passed in?
// Read about it.
if(process.argv[2] === '-i') {
    importData();
} else if(process.argv[2] == '-d') {
    deleteData();
}

