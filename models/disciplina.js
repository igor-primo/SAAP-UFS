const db = require('../db');
const {customError} = require('../errors/custom');
const joi = require('joi');

async function get_disciplinas_cadastradas(id){

	try {
		/* Checagem de dados */

		if(joi.number().integer().positive()
			.validate(id).error)
			throw new customError(
				'O identificador de usuário precisa ser um número inteiro positivo',
				300
			);

		/* Após checagem */

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

		/* Checagem de dados */

		if(!id ||
			joi.number().integer().positive()
				.validate(id).error)
			throw new customError(
				'Os identificadores de usuário e professor responsável precisam ser números inteiros positivos.',
				300
			);

		if(!nome_disc
			|| joi.string().min(1).max(100)
					.validate(nome_disc).error)
			throw new customError(
				'O nome da disciplina precisa ter no mínimo 1 caracter e no máximo 200 caracteres.',
				300
			);

		/* Após checagem */

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

		/* Checagem de dados */

		if(!id_us_arr 
			|| joi.array().items(
				joi.number().integer().positive()
			).validate(id_us_arr).error)	
			throw new customError(
				'O vetor de identificadores precisa ser de números inteiros positivos.',
				300
			);

		if(!disc_id
			|| joi.number().integer().positive()
				.validate(disc_id).error)
			throw new customError(
				'O identificador de disciplina precisa ser um número inteiro positivo.',
				300
			);

		/* Após checagem */

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

		/* Checagem de  dados */

		if(!disc_id
			|| joi.number().integer().positive()
				.validate(disc_id).error)
			throw new customError(
				'O identificador de disciplina precisa ser um número inteiro positivo.',
				300
			);

		/* Após checagem */

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
