const asyncWrapper = require('../utils/async');
const models = require('../models/resultado');

const get_resultado = asyncWrapper(async (req, res) => {
	const id_gru = req.params.id_gru;

	const resultado = 
		await models.get_resultado(id_gru);

	return res.status(200).json(resultado);
});

const post_resultado =  asyncWrapper(async (req, res) => {
	const id_gru = req.body.id_gru;

	await models.post_resultado(id_gru);

	return res.status(200).json({});
});

module.exports = {
	get_resultado,
	post_resultado
};
