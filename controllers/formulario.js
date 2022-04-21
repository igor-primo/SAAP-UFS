const asyncWrapper = require('../utils/async');
const models = require('../models/formulario');

const post_formularios_cadastrados = asyncWrapper(async (req, res) => {

	const id_proj = req.params.id_proj;
	const data_comeco = req.body.data_comeco;
	const data_fim = req.body.data_fim;
	const secoes = req.body.secoes; // array

	await models.post_formularios_cadastrados(
		id_proj,
		data_comeco,
		data_fim,
		secoes,
	);

	return res.status(201).send();

});

module.exports = {

	post_formularios_cadastrados

};
