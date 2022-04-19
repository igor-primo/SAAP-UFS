const db = require('../db');
const {customError} = require('../errors/custom');

async function get_disciplinas_cadastradas(id){

	try {

		const disciplinas =
			await db.query(
				`SELECT disc.id, disc.nome_disc FROM
					disciplina AS disc
				INNER JOIN disc_cad AS di
				ON di.disc_id = id
				INNER JOIN usuario AS us
				ON di.disc_cad = us.id
				WHERE $1 = us.id;`,
				[ id ]
			);

		return disciplinas.rows;

	} catch (e) {

		throw e;

	}

}

async function post_disciplinas_cadastradas(nome_disc, prof_resp){

	try {

		//TODO: i can return
		//the resulting id
		//of the disciplina
		//to include in 
		//req.user

		const queryres = 
			await db.query(
				`INSERT INTO 
					disciplina
				VALUES(
					DEFAULT,
					$1,
					$2
				);`,
				[
					nome_disc,
					prof_resp
				]
			);

		return;

	} catch(e) {

		throw e;

	}

}

async function cadastrar_usuario(
	disc_cad,
	disc_id
){

	try {

		await db.query(
			`INSERT INTO 
				disc_cad
			VALUES(
				$1,
				$2
			);`,
			[
				disc_cad,
				disc_id
			]
		);

		return;

	} catch(e) {

		throw e;

	}

}

module.exports = {

	get_disciplinas_cadastradas,
	post_disciplinas_cadastradas,
	cadastrar_usuario

};
