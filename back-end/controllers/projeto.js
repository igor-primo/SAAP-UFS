const asyncWrapper = require('../utils/async');
const models = require('../models/projeto');

const get_projetos_cadastrados = asyncWrapper(async (req, res) => {

	const id_disc = req.params.id_disc;

	const projetos = await models.get_projetos_cadastrados(id_disc);

	return res.status(200)
		.json(projetos);

});

const post_projetos_cadastrados = asyncWrapper(async (req, res) => {

	const id_disc = req.params.id_disc;
	const nome = req.body.nome;
	const is_indiv = req.body.is_indiv || false;
	const is_pond = req.body.is_pond || false;
	const peso = req.body.peso || null;
	const data_apres = req.body.data_apres || new Date(); //date object

	//TODO: prep data_apres for db

	const projeto = 
		await models.post_projetos_cadastrados(
			id_disc,
			nome,
			is_indiv,
			is_pond,
			peso,
			data_apres
		);

	return res.status(201).json(projeto);

});
module.exports = {

	get_projetos_cadastrados,
	post_projetos_cadastrados

};
