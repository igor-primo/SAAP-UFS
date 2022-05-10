const asyncWrapper = require('../utils/async');
const models = require('../models/usuario');

const get_users = asyncWrapper(async (req, res) => {
	const is_aluno = req.body.is_aluno;
	console.log(is_aluno);

	const users =
		await models.get_users(is_aluno);

	res.status(200).json(users);
});

module.exports = {
	get_users
};
