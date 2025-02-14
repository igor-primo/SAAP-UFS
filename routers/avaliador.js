const express = require('express');
const avaliadorController = require('../controllers/avaliador');
const passport = require('../strategies/configure');

const {

	initialize,
	authenticate

} = passport.configure();

const router = express.Router();

router.use(initialize());
const auth = _ => authenticate('jwt', {session:false});

router.route('/:id_proj/avaliadores')
	.all(auth())
	.get(avaliadorController.get_avaliadores);

router.route('/post_avaliadores')
	.all(auth())
	.post(avaliadorController.post_avaliadores);

module.exports = router;
