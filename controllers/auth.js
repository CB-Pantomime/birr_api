const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Educator = require('../models/Educator');



// @desc        Register Educator
// @route       POST /api/v1/auth/register
// @access      Public

exports.register = asyncHandler( async (req, res, next) => {

    const { name, email, password, role } = req.body;

    // Create educator/user
    const educator = await Educator.create({
      name,
      email,
      password,
      role
    });   

    sendTokenResponse(educator, 200, res);
    // res
    // .status(200)
    // .json({ success: true , data: educator });
});



// @desc        Login Educator
// @route       POST /api/v1/auth/login
// @access      Public

exports.login = asyncHandler( async (req, res, next) => {

    const { email, password } = req.body;

    // Validate email & password
    if(!email || !password) {
        return next(new ErrorResponse('Please provide email & password', 400));
    }

    // Check for user
    // mongoose.js - .select() Specifies which document fields to include or
    // exclude (also known as the query "projection")
    // When using string syntax, prefixing a path with - will flag that path as     excluded. When a path does not have the - prefix, it is included. Lastly, if a path is prefixed with +, it forces inclusion of the path, which is useful for paths excluded at the schema level.
    const educator = await Educator.findOne({ email: email }).select('+password');

    if(!educator) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await educator.matchPassword(password);

    if(!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Gets TOKEN from model, creates COOKIE and sends RESPONSE
    sendTokenResponse(educator, 200, res);

});




















//  ****** BELOW EVERYTHING ELSE ******
// Helper function, so at the bottom, below route handlers/controller methods
// Gets TOKEN from model, creates COOKIE and sends RESPONSE
const sendTokenResponse = (currentUser, statusCode, res) => {

    // GET token from model passed in argument
    // getSignedJwtToken() method accessed from our Model
    // Sign JWT and return
    const token = currentUser.getSignedJwtToken();
  
    const options = {
      expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 ), 
      // Assists in session management, personalization, tracking
      // httpOnly: only sent int HTTP request to the server, never accessible
      // reading or writing, from JS running in the browser.
      httpOnly: true
    };
  
    // If we are in production mode on server then create secure field in
    // options and set to true
    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }
  
    res
        // passing in w/e statusCode passed in to parent function
      .status(statusCode)
        // .cookie(the key name, the actual token, the options)
        // actual token = our const token ref to model passed in w/
        // getSingedJwtToken() method in model
      .cookie('token', token, options)
        // token is token, could write just 'token' ES6 style
      .json({ success: true , token: token })
};

