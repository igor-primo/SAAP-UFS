const db = require('../db');
const {customError} = require('../errors/custom');

async function get_users(is_aluno){
	console.log(is_aluno);
	try {
		const { rows } =
			await db.query(
				`SELECT id, username
					FROM usuario
				WHERE is_aluno = $1`,
				[ is_aluno ]
			);
		console.log(rows);
		return rows;
	} catch(e){
		throw e;
	}
}

module.exports = {
	get_users,
};
