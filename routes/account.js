const express = require("express");
const router = express.Router();
const { check } = require('express-validator');
const { ensureLogin ,isClerk, loadLogin, loadSignup, login, signup, logout, loadDashboard } = require('../controllers/account');

router.get('/login', loadLogin);
router.get('/dashboard',loadDashboard)
router.get('/signup', loadSignup);

router.get('/logout', ensureLogin, logout);

router.post('/signup',[
    check('firstname', 'First name is required').not().isEmpty(),
    check('lastname', 'Last name is required').not().isEmpty(),
    check('email', 'Invalid email address').not().isEmpty().isEmail().withMessage('Invalid email address'),
    check('password', 'Invalid password').not().isEmpty().trim().isAlphanumeric().withMessage('Password must contain only numbers and letters'),
    check('password').trim().isLength({ min: 6 }).trim().withMessage('Password must contain 6 or more characters')
], signup);

router.post('/login',[ check('loginemail', 'Invalid email address').not().isEmpty(),
check('loginpassword', 'Invalid password').not().isEmpty()], login);

module.exports = router;