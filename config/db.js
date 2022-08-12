const mongoose = require('mongoose');
const colors = require('colors');

require('dotenv').config({ path: './config/config.env' });

// A function that we can export and use it in our server.js
const connectDB = async () => {

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`--> --> 🐣 🐣 MongoDB Connected: ${conn.connection.host} <-- <--`.white.bgCyan.underline.inverse.bold);

};

module.exports = connectDB;