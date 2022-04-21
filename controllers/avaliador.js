const asyncWrapper = require('../utils/async');
const models = require('../models/avaliador');

const get_users = asyncWrapper(async (req, res) => {

	const id_us = req.user.id;

	const users = await models.get_users(id_us);

	return res.status(200)
		.json(users);

});

module.exports = {

	get_users

};
