const asyncWrapper = require('../utils/async');
const models = require('../models/avaliador');

const get_avaliadores = asyncWrapper(async (req, res) => {

	const id_gru = req.params.id_gru;

	const avaliadores = await models.get_avaliadores(id_us);

	return res.status(200)
		.json(avaliadores);

});

const post_avaliadores = asyncWrapper(async (req, res) => {

	const id_us = req.body.id_us;
	const id_disc = req.body.id_disc;

	await models.post_users(id_us, id_disc);

	return res.status(201).send();

});

module.exports = {

	get_avaliadores,
	post_avaliadores

};
