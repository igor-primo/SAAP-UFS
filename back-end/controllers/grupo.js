const asyncWrapper = require('../utils/async');
const models = require('../models/grupo');

const get_grupos_cadastrados = asyncWrapper(async (req, res) => {

	const id_proj = req.params.id_proj;

	const grupos = await models.get_grupos_cadastrados(id_proj);

	return res.status(200)
		.json(grupos);

});

const post_grupos_cadastrados = asyncWrapper(async (req, res) => {

	const nome = req.body.nome;
	const tema = req.body.tema;
	const id_proj = req.params.id_proj;

	const projeto = 
		await models.post_grupos_cadastrados(
			nome,
			tema,
			id_proj
		);

	return res.status(201).json(projeto);

});
module.exports = {

	get_grupos_cadastrados,
	post_grupos_cadastrados

};
