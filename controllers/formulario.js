const asyncWrapper = require('../utils/async');
const models = require('../models/formulario');

const post_formularios_cadastrados = asyncWrapper(async (req, res) => {

	const id_proj = req.params.id_proj || null;
	/* Problema */
	const data_comeco = req.body.data_comeco || new Date(); //date object
	const data_fim = req.body.data_fim || new Date(); // date object
	
	const secoes = req.body.secoes || null;

	await models.post_formularios_cadastrados(
		id_proj,
		data_comeco,
		data_fim,
		secoes,
	);

	return res.status(201).json({});

});

const get_formularios_cadastrados = asyncWrapper(async (req, res) => {

	const id_proj = req.params.id_proj || null;

	const formulario = 
		await models.get_formularios_cadastrados(id_proj);

	return res.status(200)
		.json(formulario);

});

module.exports = {

	post_formularios_cadastrados,
	get_formularios_cadastrados

};
