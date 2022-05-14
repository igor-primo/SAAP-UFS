const db = require('../db');
const bcrypt = require('bcryptjs');
const {customError} = require('../errors/custom');

async function post_avaliacao(id_av, id_gru, nota){
	try {
		/* 1 pessoa não pode avaliar mais de uma vez */
		const { rows } =
			await db.query(
				`SELECT fk_avaliador
					FROM avaliacao
				WHERE fk_grupo = $1
					AND fk_avaliador = $2;`,
				[ id_gru, id_av ]
			);
		if(rows.length > 0)
			throw new customError(
				'Um avaliador pode avaliar apenas uma vez. Cadastro de avaliacao falhou.',
				300
			);
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
	post_avaliacao
};
