const path = require('path');
const advancedResults = require('../middleware/advancedResults');
const asyncHandler = require('../middleware/async');
const Educator = require('../models/Educator');
const Student = require('../models/Student');


// @desc        Get all educators
// @route       GET /api/v1/educators
// @access      Private
exports.getEducators = asyncHandler( async (req, res, next) => {
    // await MyModel.find({});
    const educators = await Educator.find()
    res.status(200).json({
        success: true,
        data: educators
    });
});



// @desc        Get single educator
// @route       GET /api/v1/educators/:id
// @access      Private
exports.getEducator = asyncHandler( async (req, res, next) => {

    const educator = await Educator.findById(req.params.id);
    
    res.status(200).json({
        success: true,
        data: educator 
    });

});



// @desc        Get all students belonging to educator
// @route       GET /api/v1/educators/:id/allStudents
// @access      Private
exports.getAllStudentsOneEducator = asyncHandler( async (req, res, next) => {
    // req.params.id

    // const allStudents = await Student.find({}, {
    //     "_id": 0,
    //     "educator": 1
    // })
    const educatorId = req.params.id;

    const allStudents = await Student.find().where('educator').in(educatorId).exec() 

    res.status(200).json({
        success: true,
        data: allStudents
    });

});


// @desc        Create educator
// @route       POST /api/v1/educators
// @access      Private - ADMIN ONLY
exports.createEducator = asyncHandler( async (req, res, next) => {


    const educator = await Educator.create(req.body);

    res
    .status(201).json({
        success: true,
        data: educator
    });
});




// @desc        Update educator
// @route       PUT /api/v1/educators/:id
// @access      Private
exports.updateEducator = asyncHandler( async (req, res, next) => {

    const educator = await Educator.findByIdAndUpdate(req.params.id, req.body, 
        {
        new: true,
        // read about runValidators
        runValidators: true
        });
    
    res.status(201).json({
        success: true,
        data: educator 
    });

});


// @desc        Delete educator
// @route       DELETE /api/v1/educators/:id
// @access      Private
exports.deleteEducator = asyncHandler( async (req, res, next) => {

    const educator = await Educator.findById(req.params.id);

    educator.remove();
    res.status(200).json({
        success: true,
        data: {}  
    });
});


