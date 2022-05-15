const db = require('../db');
const {customError} = require('../errors/custom');
const joi = require('joi');

async function get_grupos_cadastrados(id){

	try {

		/* Checagem de dados */

		if(!id
			|| joi.number().integer().positive()
				.validate(id).error)
			throw new customError(
				'O identificador de projeto precisa ser um número inteiro e positivo.',
				300
			);

		/* Após checagem */

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

		/* Checagem de dados */

		if(!id_proj 
			|| joi.number().integer().positive()
				.validate(id_proj).error)
			throw new customError(
				'o identificador de projeto precisa ser um número inteiro e positivo.',
				300
			);

		if(!nome || !tema
			|| joi.string().min(1).max(200)
					.validate(nome).error
			|| joi.string().min(1).max(200)
					.validate(tema).error)
			throw new customError(
				'O nome do grupo e o tema precisam ter no mínimo 1 caractere e no máximo 200.',
				300
			);

		/* Após checagem */

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

		/* Checagem de dados */

		if(!id_gru 
			|| joi.number().integer().positive()
				.validate(id_gru).error)
			throw new customerror(
				'o identificador grupo precisa ser um número inteiro e positivo.',
				300
			);

		/* Após checagem */
		const { rows } = 
			await db.query(
				`SELECT us.id, us.username FROM
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

		/* Checagem de dados */

		if(!id_gru 
			|| joi.number().integer().positive()
				.validate(id_gru).error)
			throw new customError(
				'o identificador grupo precisa ser um número inteiro e positivo.',
				300
			);

		if(!id_us_arr
			|| joi.array().items(
				joi.number().integer().positive(),
			).validate(id_us_arr).error)
			throw new customError(
				'O vetor de indentificadores de integrantes precisa conter apenas inteiros positivos.',
				300
			);

		/* Após checagem */

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
