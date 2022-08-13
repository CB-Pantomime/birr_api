const express = require('express');

const { 
    getStudents, 
    getStudent, 
    createStudent,
    updateStudent,
    deleteStudent
} = require('../controllers/students.js');

// const Student = require('../models/Student.js');
// const advancedResults = require('../middleware/advancedResults.js');
// advancedResults(Student, 'works'),
const router = express.Router();

router
    .route('/')
        .get(getStudents)
        .post(createStudent);

router
    .route('/:id')
        .get(getStudent)
        .put(updateStudent)
        .delete(deleteStudent)


module.exports = router;