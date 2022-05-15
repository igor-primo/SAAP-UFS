const db = require('../db');
const bcrypt = require('bcryptjs');
const {customError} = require('../errors/custom');
const {JWTissuer} = require('../strategies/jwt-issuer');
const joi = require('joi');

async function post_periodo_avaliacao(
	id_proj, iniciado_b, terminado_b
){
	try {

		/* Checagem de dados */

		if(!id_proj
			|| joi.number().integer().positive()
				.validate(id_proj).error)
			throw new customError(
				'O identificador de projeto deve ser um inteiro positivo.',
				300
			);

		if(!(iniciado_b == true)
			&& !(iniciado_b == false)
			&& !(terminado_b == true)
			&& !(terminado_b == false))
			throw new customError(
				'Algum dos booleanos possui valor inválido.',
				300
			);

		/* Após checagem */

		await db.query(
			`UPDATE periodo_avaliacao
				SET
			iniciado_b = $1,
			terminado_b = $2;`,
			[ iniciado_b, terminado_b ]
		);

	} catch(e){
		throw e;
	}
}

module.exports = {
	post_periodo_avaliacao
};
