const db = require('../db');
const bcrypt = require('bcryptjs');
const {customError} = require('../errors/custom');

async function post_avaliacao(id_av, id_gru, nota){
	try {
		await db.query(
			`INSERT INTO
				avaliacao
			VALUES(
				$1,
				$2,
				$3
			);`,
			[ id_av, id_gru, nota ]
		);
	} catch(e){
		throw e;
	}
}

module.exports = {

};
