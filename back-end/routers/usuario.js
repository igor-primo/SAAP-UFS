const express = require('express');
const usuarioController = require('../controllers/usuario');
const passport = require('../strategies/configure');
const {authenticate} = passport.configure();

const router = express.Router();
const auth = _ => authenticate('jwt', {session:false});

// Retorna lista de usuários
// De alunos, se is_aluno for true

router.route('/')
	.all(auth())
	.post(usuarioController.get_users);

module.exports = router;
