const mongoose = require('mongoose');

const AllUserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
      },
    role: {
      type: String,
      enum: ['educator', 'student'],
      default: 'educator'
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    classroomName: {
      type: String,
      unique: true,
      required: [true, 'Please add a classroom name.']
    },
    createdAt: {
      type: Date,
      default: Date.now
    } 
});



module.exports = mongoose.model('AllUser', AllUserSchema);
