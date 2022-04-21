const express = require('express');
const formularioController = require('../controllers/formulario');
const passport = require('../strategies/configure');
const {authenticate} = passport.configure();

const router = express.Router();
const auth = _ => authenticate('jwt', {session:false});

router.route('/:id_proj/projeto')
	.all(auth())
	.post(formularioController.post_formularios_cadastrados);

module.exports = router;
