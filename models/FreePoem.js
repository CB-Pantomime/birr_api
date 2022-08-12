const mongoose = require('mongoose');

const FreePoemSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'Please add a title'],
    },
    text: {
        type: String,
        required: [true, 'Please add text']
    },
    name: {
        type: String,
        required: [true, 'Please add your name']
    },
    createdAt: {
        type: Date,
        default: Date.now
    } ,
    educatorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Educator',
        required: true
    },
    studentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'student',
        required: true
    },
});



module.exports = mongoose.model('FreePoem', FreePoemSchema);