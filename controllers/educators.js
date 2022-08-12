

const path = require('path');

const asyncHandler = require('../middleware/async');



// @desc        Get all educators
// @route       GET /api/v1/educators
// @access      Private
exports.getEducators = asyncHandler( async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: {
            message: 'Read all educators. Admin only'
        }
    });
});



// @desc        Get single educator
// @route       GET /api/v1/educators/:id
// @access      Private
exports.getEducator = asyncHandler( async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: {
            message: 'Read single educators. Admin only'
        }
    });
});



// @desc        Create educator
// @route       POST /api/v1/educators
// @access      Private
exports.createEducator = asyncHandler( async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: {
            message: 'Create educator. On sign up or by admin.'
        }
    });
});




// @desc        Update educator
// @route       PUT /api/v1/educators/:id
// @access      Private
exports.updateEducator = asyncHandler( async (req, res, next) => {
       res.status(200).json({
        success: true,
        data: {
            message: `Update educator w/ ${req.params.id} as logged in/auth educator.`
        }
    });
});


// @desc        Delete educator
// @route       DELETE /api/v1/educators/:id
// @access      Private
exports.deleteEducator = asyncHandler( async (req, res, next) => {
    res.status(200).json({
     success: true,
     data: {
         message: `Delete educator w/ ${req.params.id} as logged in/auth educator.`
     }
 });
});


