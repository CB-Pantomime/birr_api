const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Educator = require('../models/Educator');
const Student = require('../models/Student');


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




// @desc        Login Student
// @route       POST /api/v1/auth/login
// @access      Public

exports.loginStudent = asyncHandler( async (req, res, next) => {

  const { name, password } = req.body;

  // Validate email & password
  if(!name || !password) {
      return next(new ErrorResponse('Please provide email & password', 400));
  }

  // Check for user
  // mongoose.js - .select() Specifies which document fields to include or
  // exclude (also known as the query "projection")
  // When using string syntax, prefixing a path with - will flag that path as     excluded. When a path does not have the - prefix, it is included. Lastly, if a path is prefixed with +, it forces inclusion of the path, which is useful for paths excluded at the schema level.
  const student = await Student.findOne({ name: name }).select('+password');

  if(!student) {
      return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await student.matchPassword(password);

  if(!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Gets TOKEN from model, creates COOKIE and sends RESPONSE
  sendTokenResponse(student, 200, res);

});


// @desc        Get current logged in user
// @route       POST /api/v1/auth/me
// @access      Private
exports.getMe = asyncHandler(async (req, res, next) => {
  let user = await Educator.findById(req.id);

  if(!user) {
    user = await Student.findById(req.id);
    console.log('fetched id from STUDENT model')
  }

  res.status(200).json({
    success: true,
    data: user
  });
})  





// @desc        Update user details
// @route       PUT /api/v1/auth/details
// @access      Private

exports.updateDetails = asyncHandler(async (req, res, next) => {

  // Calling out just for name and email, not the full req.body
  // taking in req.body would update everything in the model for that 
  // user, and we don't want that. We want to just update name and email.
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  }

  // -->      .findByIdAndUpdate(id, what to update, options). 
  const user = await Educator.findByIdAndUpdate(req.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });
  
  res
    .status(200)
    .json({ success: true, data: user });
})







// @desc        Update password
// @route       PUT /api/v1/auth/updatepassword
// @access      Private
exports.updatePassword = asyncHandler(async (req, res, next) => {

  // In the req.body the user is going to send the current password
  // and the new password  
  // Since by default we have <select: false> for the user password
  // we need to use our .select() method here telling our program 
  // to get that password field/value, after we findById the req.user.id
  const user = await Educator.findById(req.id).select('+password');

  // Check current password from the req.body sent in
  if(!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }
  
  // At the Educator object model the user password now equal/set to
  // newPassword which is coming from the request body 
  user.password = req.body.newPassword;
  // Save dat!
  await user.save();

  // Calling our send token response controller method:
  // Which Gets TOKEN from model, creates COOKIE and sends RESPONSE
  // **SYNTAX**:  sendTokenResponse = (user, statusCode, res)
  sendTokenResponse(user, 200, res);
})








// @desc        Forgot password
// @route       POST /api/v1/auth/forgotpassword
// @access      Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  let user = await Educator.findOne( { email: req.body.email });

  if(!user) {
    return next(new ErrorResponse('Invalid credentials', 404));
  }



  // Get reset token
  const resetToken = user.getResetPasswordToken();

  console.log(` Success. Reset token: ${resetToken}`);

  await user.save({ validateBeforeSave: false });


  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;


  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      // NOTE:
      // mailtrap and/or nodemailer showing preference for ES6
      // if field-value is text: options.message
      // then just place message, not text: options.message
      // Otherwise text is not available at mailtrap read inbox for text part of email 
      message
    });
    res.status(200).json({ success: true, data: 'Email sent' });

  } catch(err) {
    // return next(new ErrorResponse('', 401))
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500))
  }

  res.status(200).json();
})  



// @desc        Reset password
// @route       PUT /api/v1/auth/resetpassword/:resettoken
// @access      Public
exports.resetPassword = asyncHandler(async (req, res, next) => {

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if(!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);

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

