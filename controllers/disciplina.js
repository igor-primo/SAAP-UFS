const asyncWrapper = require('../utils/async');
const models = require('../models/disciplina');

const get_disciplinas_cadastradas = asyncWrapper(async (req, res) => {

	const id = req.user.id || null;

	const disciplinas = 
		await models.get_disciplinas_cadastradas(id);

	return res.status(200)
		.json(disciplinas);

});

const post_disciplinas_cadastradas = asyncWrapper(async (req, res) => {
	
	const id = req.user.id || null;
	const nome_disc = req.body.nome_disc || null;
	const prof_resp = req.user.id || null;

	await models.post_disciplinas_cadastradas(
		id, nome_disc, prof_resp
	);

	return res.status(201).json({});

});

const cadastrar_usuario = asyncWrapper(async (req, res) => {

	const id_us_arr = req.body.id_us_arr || null;
	const disc_id = req.body.disc_id || null;

	//TODO: how to make sure that
	//i am responsible for this discipline?

	await models.cadastrar_usuario(
		id_us_arr, disc_id
	);

	return res.status(201).json({});

});

const get_integrantes = asyncWrapper(async (req, res) => {
	const disc_id = req.params.disc_id || null;

	const integrantes = 
		await models.get_integrantes(disc_id);

	return res.status(200)
		.json(integrantes);
});

module.exports = {

	get_disciplinas_cadastradas,
	post_disciplinas_cadastradas,
	cadastrar_usuario,
	get_integrantes

};
