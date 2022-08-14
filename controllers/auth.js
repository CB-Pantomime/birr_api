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
    const educator = await educator.findOne({ email: email }).select('+password');

    if(!educator) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await educator.matchPassword(password);

    if(!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(educator, 200, res);

});




















//  ****** BELOW EVERYTHING ELSE ******
// Helper function, so at the bottom, below route handlers/controller methods
// Get TOKEN from model, create COOKIE and send RESPONSE
const sendTokenResponse = (educator, statusCode, res) => {

    // GET token
    const token = educator.getSignedJwtToken();
  
    const options = {
      expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 ), 
      // Assists in session management, personalization, tracking
      // httpOnly: only sent int HTTP request to the server, never accessible
      // reading or writing, from JS running in the browser.
      httpOnly: true
    };
  
    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }
  
    res
      .status(statusCode)
        // .cookie(the key name, the actual token, the options)
      .cookie('token', token, options)
      .json({ success: true , token: token })
};

