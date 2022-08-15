
// need this to verify the token, obvi
const jwt = require('jsonwebtoken');
// fancy home mode async handler
const asyncHandler = require('./async');
// super helpful error response handler
const ErrorResponse = require('../utils/errorResponse');
// Educator (user) model that we will use our auth.js middleware upon
const Educator = require('../models/Educator');

// Protect routes
exports.protect = asyncHandler( async (req, res, next) => {
    let token;
    // access request body headers, this is built in from node http module, i think?
    // if req headers auth exists AND req headers auth starts with Bearer
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // then
        // split into array at space after 'Bearer' take index of 1 (the token)
        token = req.headers.authorization.split(' ')[1];
    }

    else if(req.cookies.token) {
        token = req.cookies.token
    }

    // Make sure token exist in relation to our db/and user
    if(!token) {
        return next(new ErrorResponse('Not authorized', 401));
    }

    // Verify token
    try {
        // Example payload:
        // {
                    // User ObjectId
        //   "id": "62f81f7722fd6db064b94e17",
                    // Issued At
        //   "iat": 1660506829,
                    // Expires On
        //   "exp": 1684180429
        // }
        // --> --> Extract payload:
        // JWT's .verify() method args = (the token, the secret, options, cb(err, decoded))
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.id = await Educator.findById(decoded.id)

        // TO BE LEVERAGED AGAINST THE UPCOMING STUDENT MODEL/collection
        // if(!req.currentUser) {
        //     req.currentUser = await Student.findById(decoded.id)
        // }

        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized', 401));
    }

});


