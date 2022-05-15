const db = require('../db');
const bcrypt = require('bcryptjs');
const {customError} = require('../errors/custom');
const joi = require('joi');

async function get_avaliadores(id_proj){

	try {

		/* Checagem de dados. */

		if(!id_proj ||
			joi.number().integer().positive()
				.validate(id_proj).error)
			throw new customError(
				'O identificador de projeto precisa ser um número inteiro positivo.',
				300
			);

		/* Após checagem */

		const { rows } =
			await db.query(
				`SELECT us.id, us.username FROM
					usuario AS us
				INNER JOIN
					avaliador AS av
				ON av.fk_id_us = us.id
				WHERE av.fk_id_proj = $1;`,
				[ id_proj ]
			);

		console.log(rows);

		return rows;

	} catch(e) {

		throw e;

	}

}

async function post_avaliadores(id_us_arr, id_proj){
	try {

		/* Checagem de dados */
		
		if(!id_us_arr || !id_proj
			|| joi.array().items(
				joi.number().integer().positive()
			).validate(id_us_arr).error
			|| joi.number().integer().positive())
			throw new customError(
				'O vetor de identificadores precisa ser de números inteiros positivos e o identificador de projeto precisa ser inteiro positivo.',
				300
			);

		/* Após checagem */

		for(let i=0;i<id_us_arr.length;i++)
			await db.query(
				`INSERT INTO
					avaliador
				VALUES(
					$1,
					$2
				);`,
				[ id_us_arr[i], id_proj ]
			);
	} catch(e){
		throw e;
	}
}

module.exports = {

	get_avaliadores,
	post_avaliadores

};
