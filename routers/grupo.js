const express = require('express');
const grupoController = require('../controllers/projeto');
const passport = require('../strategies/configure');
const {authenticate} = passport.configure();

const router = express.Router();
const auth = _ => authenticate('jwt', {session:false});

router.route('/:id_proj/projeto')
	.all(auth())
	.get(grupoController.get_grupos_cadastrados)
	.post(grupoController.post_grupos_cadastrados);

module.exports = router;
