const db = require('../db');
const bcrypt = require('bcryptjs');

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

module.exports = {
	signup
};
