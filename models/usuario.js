const db = require('../db');
const {customError} = require('../errors/custom');

async function get_users(is_aluno){
	try {
		/* Checagem de dados */

		if(!(is_aluno === true)
			|| !(is_aluno === false))
			throw new customError(
				'Preciso saber se os usuários devem ser alunos ou professores.',
				300
			);

		/* Após checagem */

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
