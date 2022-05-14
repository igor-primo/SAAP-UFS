const express = require('express');
const avaliacaoController = require('../controllers/avaliacao');
const passport = require('../strategies/configure');

const {

	initialize,
	authenticate

} = passport.configure();

const router = express.Router();

router.use(initialize());
const auth = _ => authenticate('jwt', {session:false});

router.route('/post_avaliacao')
	.all(auth())
	.post(avaliacaoController.post_avaliacao);

module.exports = router;
