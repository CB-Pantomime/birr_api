
const express = require('express');

const { 
    getEducators, 
    getEducator, 
    createEducator,
    updateEducator,
    deleteEducator,
    getAllStudentsOneEducator
} = require('../controllers/educators.js');

// const Educator = require('../models/Educator.js');
// const advancedResults = require('../middleware/advancedResults.js');
// advancedResults(Educator, 'educator'),
const router = express.Router();

// Protect routes w/ signed in, authorized user, token in cookies
const { protect, authorize } = require('../middleware/auth');
// authorize('admin', 'educator'), 


router
    .route('/')
        .get(protect, getEducators)
            // To be protected? Consider user flow when signing up and then 
            // creating an educator account...
        .post(createEducator);

router
    .route('/:id')
        .get(protect, getEducator)
        .put(protect, updateEducator)
        .delete(protect, deleteEducator)

router
    .route('/:id/allStudents')
        .get(protect, getAllStudentsOneEducator);


        
module.exports = router;