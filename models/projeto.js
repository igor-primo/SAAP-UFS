const db = require('../db');
const {customError} = require('../errors/custom');

async function get_projetos_cadastrados(id){

	try {

		const queryres = await db.query(
			`SELECT id, nome, data_apres, is_pond, peso_prof, peso_alun FROM
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
	is_pond,
	peso_prof,
	peso_alun,
	data_apres,
	id_us
){

	const client = await db.getClient();

	try {

		const queryres = await client.query(
			`INSERT INTO
				projeto
			VALUES(
				DEFAULT,
				$1,
				$2,
				$3,
				$4,
				$5,
				$6,
				$7
			) RETURNING id, nome;`,
				[
					nome,
					id_disc,
					is_indiv,
					is_pond,
					peso_prof,
					peso_alun,
					data_apres
				]
		);
		const id_proj = queryres.rows[0].id;
		await client.query(
			`INSERT INTO
				avaliador
			VALUES(
				$1,
				$2
			);`,
			[ id_us, id_proj ]
		);

		client.query('COMMIT');
		client.release();

		return queryres.rows[0];

	} catch(e) {

		client.query('ROLLBACK');
		client.release();
		throw e;

	}


}

module.exports = {

	get_projetos_cadastrados,
	post_projetos_cadastrados

};
