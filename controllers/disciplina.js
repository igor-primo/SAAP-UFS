const asyncWrapper = require('../utils/async');
const models = require('../models/disciplina');

const get_disciplinas_cadastradas = asyncWrapper(async (req, res) => {

	const id = req.user.id;

	const disciplinas = 
		await models.get_disciplinas_cadastradas(id);

	return res.status(200)
		.json(disciplinas);

});

const post_disciplinas_cadastradas = asyncWrapper(async (req, res) => {
	
	const nome_disc = req.body.nome_disc;
	const prof_resp = req.user.id;

	await models.post_disciplinas_cadastradas(
		nome_disc, prof_resp
	);

	return res.status(201).send();

});

const cadastrar_usuario = asyncWrapper(async (req, res) => {

	const disc_cad = req.body.id_us;
	const disc_id = req.body.disc_id;

	//TODO: how to make sure that
	//i am responsible for this discipline?

	await models.cadastrar_usuario(
		disc_cad, disc_id
	);

	return res.status(201).send();

});

module.exports = {

	get_disciplinas_cadastradas,
	post_disciplinas_cadastradas,
	cadastrar_usuario

};
