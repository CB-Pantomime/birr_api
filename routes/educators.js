
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

router
    .route('/')
        .get(getEducators)
        .post(createEducator);

router
    .route('/:id')
        .get(getEducator)
        .put(updateEducator)
        .delete(deleteEducator)

router
    .route('/:id/allStudents')
        .get(getAllStudentsOneEducator);


        
module.exports = router;