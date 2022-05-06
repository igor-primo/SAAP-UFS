const express = require('express');
const authController = require('../controllers/auth');
const passport = require('../strategies/configure');

const {

	initialize,
	authenticate

} = passport.configure();

const router = express.Router();

router.use(initialize());
const auth = _ => authenticate('jwt', {session:false});

router.route('/signup')
	.post(authController.signup);

router.route('/login')
	.post(authController.login);

router.route('/token')
	.all(auth())
	.get(authController.token);

module.exports = router;
