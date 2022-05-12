const db = require('../db');
const {customerror} = require('../errors/custom');

async function get_disciplinas_cadastradas(id){

	try {

		const disciplinas =
			await db.query(
				`SELECT disc.id, disc.nome_disc, disc.prof_resp, us2.username FROM
					disciplina AS disc
				INNER JOIN disc_cad AS di
				ON di.disc_id = disc.id
				INNER JOIN usuario AS us
				ON di.disc_cad = us.id
				INNER JOIN usuario AS us2
				ON disc.prof_resp = us2.id
				WHERE $1 = us.id;`,
				[ id ]
			);

		return disciplinas.rows;

	} catch (e) {

		throw e;

	}

}

async function post_disciplinas_cadastradas(id, nome_disc, prof_resp){

	const client = await db.getClient();

	try {

		//TODO: i can return
		//the resulting id
		//of the disciplina
		//to include in 
		//req.user

		await client.query('BEGIN');

		const queryres = 
			await client.query(
				`INSERT INTO 
					disciplina
				VALUES(
					DEFAULT,
					$1,
					$2
				) RETURNING id;`,
				[
					nome_disc,
					prof_resp
				]
			);

		const id_disc = queryres.rows[0].id;

		await client.query(
			`INSERT INTO
				disc_cad
			VALUES(
				$1,
				$2
			);`,
			[ id, id_disc ]
		);

		await client.query('COMMIT');
		client.release();

		return;

	} catch(e) {

		console.log(client);

		await client.query('ROLLBACK');
		client.release();
		throw e;

	}

}

async function cadastrar_usuario(
	id_us_arr,
	disc_id
){

	try {

		for(let i=0;i<id_us_arr.length;i++)
			await db.query(
				`INSERT INTO 
					disc_cad
				VALUES(
					$1,
					$2
				);`,
				[
					id_us_arr[i],
					disc_id
				]
			);

		return;

	} catch(e) {

		throw e;

	}

}

async function get_integrantes(disc_id){
	try {
		const { rows } = 
			await db.query(
				`SELECT us.id, us.username, us.is_aluno FROM
							usuario AS us
				INNER JOIN 
					disc_cad AS dc
				ON dc.disc_cad = us.id
				WHERE dc.disc_id = $1`,
				[ disc_id ]
			);
		console.log(rows);

		return rows;
	} catch(e){
		throw e;
	}
}

module.exports = {

	get_disciplinas_cadastradas,
	post_disciplinas_cadastradas,
	cadastrar_usuario,
	get_integrantes

};
