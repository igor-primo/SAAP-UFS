const express = require('express');
const authController = require('../controllers/auth');
const passport = require('../strategies/configure');

const {

	initialize,
	authenticate

} = passport.configure();

const router = express.Router();

router.use(initialize());

router.route('/signup')
	.post(authController.signup);

module.exports = router;
