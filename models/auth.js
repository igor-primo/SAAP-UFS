const db = require('../db');
const bcrypt = require('bcryptjs');
const {customError} = require('../errors/custom');
const {JWTissuer} = require('../strategies/jwt-issuer');

async function signup (username, password, email){

	try {

		const hash = await bcrypt.hash(password, 10);
		const queryres = await db.query(
			`SELECT id
				FROM usuario
				WHERE LOWER(email) = LOWER($1);`,
			[ email ]
		);

		if(queryres.rows.length>0)
			return {
				jaCadastrado: true,
				response: queryres.rows[0]
			};

		await db.query(
			`INSERT INTO
				usuario
			VALUES(
				DEFAULT,
				$1,
				$2,
				$3
			);`,
			[ username, hash, email ]
		);

		return {
			jaCadastrado: false,
			response: queryres.rows[0]
		};

	} catch(e) {
		
		throw e;

	}

}

async function login (email, password){

	try {

		if(!email || !password)
			throw new customError(
				'Campos incompletos',
				400
			);

		const queryres = await db.query(
			`SELECT id, password
				FROM usuario
				WHERE LOWER(email) = LOWER($1);`,
			[ email ]
		);

		if(queryres.rows.length == 0)
			throw new customError(
				'Usuário não cadastrado ou dados incorretos',
				401
			);
		else{

			const isMatch = bcrypt.compareSync(
				password, queryres.rows[0].password
			);

			if(!isMatch)
				throw new customError(
					'Usuário não cadastrado ou dados incorretos',
					401
				);

			const token = JWTissuer(queryres.rows[0].id);

			return { token };

		}

	} catch(e) {

		throw e;

	}

}

module.exports = {
	signup,
	login
};
