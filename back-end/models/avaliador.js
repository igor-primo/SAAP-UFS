const db = require('../db');
const bcrypt = require('bcryptjs');
const {customError} = require('../errors/custom');

async function get_users(id){

	try {

		const { rows } =
			await db.query(
				`SELECT id, username FROM
					usuario
				WHERE id != $1`,
				[ id ]
			);

		return rows;

	} catch(e) {

		throw e;

	}

}

module.exports = {

	get_users

};
