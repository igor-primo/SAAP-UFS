const db = require('../db');
const {customError} = require('../errors/custom');

async function get_projetos_cadastrados(id){

	try {

		const queryres = db.query(
			`SELECT id, nome FROM
				projeto
			WHERE
				fk_disc = $1`,
			[ id ]
		);
		
		return queryres.rows;

	} catch(e) {

		throw e;

	}

}

async function post_projetos_cadastrados(
	id_disc,
	nome,
	is_indiv,
	is_pond
	peso,
	data_apres
){

	try {

		const queryres = db.query(
			`INSERT INTO
				projeto
			VALUES(
				DEFAULT,
				$1,
				$2,
				$3,
				$4,
				$5,
				$6
			) RETURNING id, nome;`,
				[
					nome,
					id_disc,
					is_indiv,
					is_pond,
					peso,
					data_apres
				]
		);

		return queryres.rows[0];

	} catch(e) {

		throw e;

	}


}

module.exports = {

	get_projetos_cadastrados,
	post_projetos_cadastrados

};
