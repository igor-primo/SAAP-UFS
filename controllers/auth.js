const asyncWrapper = require('../utils/async');
const models = require('../models/auth');

// TODO: fazer validação de dados

const signup = asyncWrapper(async (req, res) => {

	console.log(req.body);

	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;

	const returned = await models.signup(
		username, password, email
	);

	if(returned.jaCadastrado)
		return res.status(200)
			.json({msg: 'Usuário já cadastrado'});
	else
		return res.status(200)
		.json(returned.response);

});

const login = asyncWrapper(async (req, res) => {

	const email = req.body.email;
	const password = req.body.password;

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
	token
};
