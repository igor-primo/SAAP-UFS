const asyncWrapper = require('../utils/async');
const models = require('../models/avaliacao');
const joi = require('joi');

const post_avaliacao = asyncWrapper(async (req, res) => {
	const id_av = req.body.id_av || null;
	const id_gru = req.body.id_gru || null;
	const nota = req.body.nota || null;

	await models.post_avaliacao(id_av, id_gru, nota);

	return res.status(200)
		.json({});
});

module.exports = {
	post_avaliacao
};
