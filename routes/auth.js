
const express = require('express');

const { 
    register, 
    login, 
    loginStudent, 
    getMe, 
    forgotPassword, 
    resetPassword,
    updateDetails,
    updatePassword
} = require('../controllers/auth');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/loginstudent', loginStudent);
router.get('/me', protect, getMe);
router.put('/details', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.post('resetpassword/:resettoken', resetPassword);


module.exports = router;