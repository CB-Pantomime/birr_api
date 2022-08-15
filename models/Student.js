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


// StudentSchema.pre('save', async function(next) {


//     // get logged in educator id
//     // set that educator id to educator field 
//     this.educator = req.educator.ObjectId
// });




module.exports = mongoose.model('Student', StudentSchema);