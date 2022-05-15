const asyncWrapper = require('../utils/async');
const models = require('../models/periodo_avaliacao');

const post_periodo_avaliacao = asyncWrapper(async (req, res) => {
	const id_proj = req.body.id_proj;
	const iniciado_b = req.body.iniciado_b;
	const terminado_b = req.body.terminado_b;

	await models.post_periodo_avaliacao(
		id_proj, iniciado_b, terminado_b
	);

	return res.status(201).json({});
});

module.exports = {
	post_periodo_avaliacao
};
