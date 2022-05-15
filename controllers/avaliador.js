const asyncWrapper = require('../utils/async');
const models = require('../models/avaliador');

const get_avaliadores = asyncWrapper(async (req, res) => {

	const id_proj = req.params.id_proj || null;

	const avaliadores = await models.get_avaliadores(id_proj);

	return res.status(200)
		.json(avaliadores);

});

const post_avaliadores = asyncWrapper(async (req, res) => {

	const id_us_arr = req.body.id_us_arr || null;
	const id_proj = req.body.id_proj || null;

	await models.post_avaliadores(id_us_arr, id_proj);

	return res.status(201).json({});

});

module.exports = {

	get_avaliadores,
	post_avaliadores

};
