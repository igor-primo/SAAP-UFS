const asyncWrapper = require('../utils/async');
const models = require('../models/grupo');

const get_grupos_cadastrados = asyncWrapper(async (req, res) => {

	const id_proj = req.params.id_proj || null;

	const grupos = await models.get_grupos_cadastrados(id_proj);

	return res.status(200)
		.json(grupos);

});

const post_grupos_cadastrados = asyncWrapper(async (req, res) => {

	const nome = req.body.nome || null;
	const tema = req.body.tema || null;
	const id_proj = req.params.id_proj || null;

	const projeto = 
		await models.post_grupos_cadastrados(
			nome,
			tema,
			id_proj
		);

	return res.status(201).json(projeto);

});

const get_integrantes = asyncWrapper(async (req, res) => {
	const id_gru = req.params.id_gru || null;

	const integrantes =
		await models.get_integrantes(id_gru);

	return res.status(200)
		.json(integrantes);
});

const post_integrantes = asyncWrapper(async (req, res) => {
	const id_gru = req.body.id_gru || null;
	const id_us_arr = req.body.id_us_arr || null;
	console.log(id_gru);

	await models.post_integrantes(id_gru, id_us_arr);

	return res.status(201).json({});
});

module.exports = {

	get_grupos_cadastrados,
	post_grupos_cadastrados,
	get_integrantes,
	post_integrantes

};
