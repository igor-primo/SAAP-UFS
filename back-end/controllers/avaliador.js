const asyncWrapper = require('../utils/async');
const models = require('../models/avaliador');

const get_users = asyncWrapper(async (req, res) => {

	const id_us = req.user.id;

	const users = await models.get_users(id_us);

	return res.status(200)
		.json(users);

});

const post_users = asyncWrapper(async (req, res) => {

	const id_us = req.body.id_us;
	const id_disc = req.body.id_disc;

	await models.post_users(id_us, id_disc);

	return res.status(201).send();

});

module.exports = {

	get_users,
	post_users

};
