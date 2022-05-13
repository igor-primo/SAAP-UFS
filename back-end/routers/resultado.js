const express = require('express');
const resultadoController = require('../controllers/resultado');
const passport = require('../strategies/configure');

const {

	initialize,
	authenticate

} = passport.configure();

const router = express.Router();

router.use(initialize());
const auth = _ => authenticate('jwt', {session:false});

router.route('/')
	.all(auth())
	.post(resultadoController.post_resultado);

router.route('/get_resultado/:id_gru')
	.all(auth())
	.get(resultadoController.get_resultado)

module.exports = router;
