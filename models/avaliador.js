const db = require('../db');
const bcrypt = require('bcryptjs');
const {customError} = require('../errors/custom');

async function get_avaliadores(id_proj){

	try {

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
