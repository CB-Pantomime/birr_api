const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const EducatorSchema = new mongoose.Schema({

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
      enum: ['educator'],
      default: 'educator'
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    students: 
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Student',
        required: false
      },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now
    } 
});




// **************************************  
// Methods and Pre/Post Middleware
// ************************************** 

// Encrypt password using bcrypt
EducatorSchema.pre('save', async function(next) {

  //  *****STUDY*****
  // if password not modified keep going, next()
  if(!this.isModified('password')) {
    next();
  }
  //  *****STUDY*****
  // This only runs if the password is modified
  // genSalt() method returns a promise so we need to use
  // await
  const salt = await bcrypt.genSalt(10);
  // accessing the password field on our Schema
  // hash() returns a promise, so using await
  // hashing it w/ the salt
  this.password = await bcrypt.hash(this.password, salt);
});




// Sign JWT and return
// .sign({data to be assigned/the user id}, the secret, {options})
EducatorSchema.methods.getSignedJwtToken = function() {
  return jwt.sign( 
    { id: this._id }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRE }
  )
};


// Match user entered password to hashed password in database
EducatorSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}


// Generate and hash password token
EducatorSchema.methods.getResetPasswordToken = function() {


  // Generate token:
  // randomBytes() returns a buffer so, toString()
  // *****Study*****    What is buffer?
  // The Buffer class in Node.js is designed to handle raw binary data. Each buffer corresponds to some raw memory allocated outside V8. Buffers act somewhat like arrays of integers, but aren't resizable and have a whole bunch of methods specifically for binary data. The integers in a buffer each represent a byte and so are limited to values from 0 to 255 inclusive. When using console.log() to print the Buffer instance, you'll get a chain of values in hexadecimal values.
  const resetToken = crypto.randomBytes(20).toString('hex');


  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

  // Set expire in ten minutes after generated
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;


  return resetToken;

};




module.exports = mongoose.model('Educator', EducatorSchema);