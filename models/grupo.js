const db = require('../db');
const {customerror} = require('../errors/custom');

async function get_grupos_cadastrados(id){

	try {

		const queryres =
			await db.query(
				`SELECT id, nome FROM
					grupo
				WHERE 
					fk_proj = $1;`,
				[ id ]
			);

		return queryres.rows;

	} catch(e) {

		throw e;

	}

}

async function post_grupos_cadastrados(
	nome,
	id_proj
){

	try {

		const queryres = 
			await db.query(
				`INSERT INTO
					grupo
				VALUES(
					DEFAULT,
					$1,
					$2
				) RETURNING id, nome;`,
				[ nome, id_proj ]
			);

		return queryres.rows[0];

	} catch(e) {

		throw e;

	}


}

module.exports = {

	get_grupos_cadastrados,
	post_grupos_cadastrados

};
