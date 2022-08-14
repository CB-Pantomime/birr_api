const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    role: {
        type: String,
        enum: ['student'],
        default: 'student'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    educator: 
        {
          type: mongoose.Schema.ObjectId,
          ref: 'Educator',
          required: true
        },
    createdAt: {
        type: Date,
        default: Date.now
    }
});



module.exports = mongoose.model('Student', StudentSchema);