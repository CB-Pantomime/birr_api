
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
// const logger = require('./middleware/logger.js');
const connectDB = require('./config/db');

// Route files
const educators = require('./routes/educators');
const students = require('./routes/students');
// Load environment variables
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();
app.use(express.json());

// Using custom logger middleware 
// app.use(logger);

// Developer loggin middleware 3rd partayyyy!
// if we are running on development server then use Morgan:
if(process.env.NODE_ENV === 'development') {
    app.use(morgan(':method :url :status'));
}

// Mount routers
app.use('/api/v1/educators', educators);
app.use('/api/v1/students', students);

const PORT = process.env.PORT || 5000;
// Express .listen() is an abstraction of, and sits on top of,
// the Node.js http module. Right? 
const server = app.listen(
    PORT, 
    console.log(`--> --> 🌏 🌎 Server running in ${process.env.NODE_ENV} mode on port ${PORT} <-- <--`.brightMagenta.underline.inverse.bold)
);


// ***** STUDY THESE BUILT IN METHODS ***** 
// Handle unhandled promise rejections
// Using this here in place of adding a try/catch on our 
// server variable's listen() method
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server and exit process
    server.close(() => process.exit(1))
});

