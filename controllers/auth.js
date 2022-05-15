const asyncWrapper = require('../utils/async');
const models = require('../models/auth');

// TODO: fazer validação de dados

const signup = asyncWrapper(async (req, res) => {

	console.log(req.body);

	const username = req.body.username || null;
	const password = req.body.password || null;
	const email = req.body.email || null;
	const matricula = req.body.matricula || null;
	const is_aluno = req.body.is_aluno;

	const returned = await models.signup(
		username, password, email,
		matricula, is_aluno
	);

	if(returned.jaCadastrado)
		return res.status(200)
			.json({msg: 'Usuário já cadastrado'});
	else
		return res.status(200).json({});

});

const login = asyncWrapper(async (req, res) => {

	const email = req.body.email || null;
	const password = req.body.password || null;

	const returned = await models.login(
		email, password
	);

	return res.status(200)
		.json(returned);

});

function token(req, res){

	console.log(req.user);

	return res.status(200).
		json(req.user);

}

module.exports = {
	signup,
	login,
	token,
};
