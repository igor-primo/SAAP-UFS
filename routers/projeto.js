const express = require('express');
const projetoController = require('../controllers/projeto');
const passport = require('../strategies/configure');
const {authenticate} = passport.configure();

const router = express.Router();
const auth = _ => authenticate('jwt', {session:false});

router.route('/:id_disc/disciplina')
	.all(auth())
	.get(projetoController.get_projetos_cadastrados)
	.post(projetoController.post_projetos_cadastrados);

module.exports = router;
