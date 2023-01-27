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
const Educator = require('../models/Educator.js');
// Protect routes w/ signed in, authorized user, token in cookies
const { protect, authorize } = require('../middleware/auth');
// authorize('admin', 'educator', 'student'), 

router
    .route('/')
        .get(protect, getStudents)
        .post(protect, createStudent);

router
    .route('/:id')
        .get(protect, getStudent)
        .put(protect, updateStudent)
        .delete(protect, deleteStudent)

module.exports = router;