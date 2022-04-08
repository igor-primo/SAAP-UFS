const db = require('../db');
const bcrypt = require('bcryptjs');
const {customError} = require('../errors/custom');
const {JWTissuer} = require('../strategies/jwt-issuer');

async function signup (username, password, email){

	const client = await db.getClient();

	try {

		const hash = await bcrypt.hash(password, 10);
		await client.query('BEGIN');
		const queryres = await client.query(
			`SELECT id
				FROM usuario
				WHERE LOWER(email) = LOWER('${email}');`
		);

		if(queryres.rows.length>0){

			await client.query('COMMIT');
			client.release();

			return {
				jaCadastrado: true,
				response: queryres.rows[0]
			};

		}

		await client.query(
			`INSERT INTO
				usuario
			VALUES(
				DEFAULT,
				'${username}',
				'${hash}',
				'${email}'
			);`
		);

		await client.query('COMMIT');
		client.release();

		return {
			jaCadastrado: false,
			response: queryres.rows[0]
		};

	} catch(e) {
		
		client.query('ROLLBACK');
		client.release();
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
				WHERE LOWER(email) = LOWER('${email}');`
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
