const asyncWrapper = require('../utils/async');
const models = require('../models/auth');

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

module.exports = {
	signup
};
