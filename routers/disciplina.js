const express = require('express');
const disciplinaController = require('../controllers/disciplina');
const passport = require('../strategies/configure');
const {authenticate} = passport.configure();

const router = express.Router();
const auth = _ => authenticate('jwt', {session:false});

router.route('/')
	.all(auth())
	.get(disciplinaController.get_disciplinas_cadastradas)
	.post(disciplinaController.post_disciplinas_cadastradas);

router.route('/cadastrar_usuario')
	.all(auth())
	.post(disciplinaController.cadastrar_usuario);

module.exports = router;
