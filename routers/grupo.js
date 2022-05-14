const express = require('express');
const grupoController = require('../controllers/grupo');
const passport = require('../strategies/configure');
const {authenticate} = passport.configure();

const router = express.Router();
const auth = _ => authenticate('jwt', {session:false});

router.route('/:id_proj/projeto')
	.all(auth())
	.get(grupoController.get_grupos_cadastrados)
	.post(grupoController.post_grupos_cadastrados);

router.route('/:id_gru/integrantes')
	.all(auth())
	.get(grupoController.get_integrantes);

router.route('/post_integrantes')
	.all(auth())
	.post(grupoController.post_integrantes);

module.exports = router;
