
const express = require('express');

const { 
    getEducators, 
    getEducator, 
    createEducator,
    updateEducator,
    deleteEducator
} = require('../controllers/educators.js');

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


module.exports = router;