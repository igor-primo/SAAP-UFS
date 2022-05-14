const db = require('../db');
const {customerror} = require('../errors/custom');

async function get_grupos_cadastrados(id){

	try {

		const queryres =
			await db.query(
				`SELECT id, nome, tema FROM
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
	tema,
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
					$2,
					$3
				) RETURNING id, nome;`,
				[ nome, tema, id_proj ]
			);

		return queryres.rows[0];

	} catch(e) {

		throw e;

	}


}

async function get_integrantes(id_gru){
	try {
		const { rows } = 
			await db.query(
				`SELECT us.username FROM
					usuario AS us
				INNER JOIN us_gru AS ug
				ON us.id = ug.fk_us
				WHERE ug.fk_gru = $1`,
				[ id_gru ]
			);
		console.log(rows);
		return rows;
	} catch(e){
		throw e;
	}
}

async function post_integrantes(id_gru, id_us_arr){
	try {
		for(let i=0;i<id_us_arr.length;i++)
			await db.query(
				`INSERT INTO
					us_gru
				VALUES(
					$1,
					$2
				);`,
				[id_us_arr[i], id_gru]
			);
	} catch(e) {
		throw e;
	}
}

module.exports = {

	get_grupos_cadastrados,
	post_grupos_cadastrados,
	get_integrantes,
	post_integrantes


};
