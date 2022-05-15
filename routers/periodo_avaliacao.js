const express = require('express');
const periodo_avaliacaoController = require('../controllers/periodo_avaliacao');
const passport = require('../strategies/configure');
const {authenticate} = passport.configure();

const router = express.Router();
const auth = _ => authenticate('jwt', {session:false});

router.route('/')
	.all(auth())
	.put(periodo_avaliacaoController.post_periodo_avaliacao);

module.exports = router;
