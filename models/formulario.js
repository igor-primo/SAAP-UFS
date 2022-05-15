const db = require('../db');
const {customError} = require('../errors/custom');
const joi = require('joi');

async function post_formularios_cadastrados(
	id,
	data_comeco,
	data_fim,
	secoes,
){
	/* Checagem de dads */

	if(!id
		|| joi.number().integer().positive().validate(id))
		throw new customError(
			'O identificador de usuário precisa ser um número inteiro positivo.',
			300
		);

	/*
	if(!data_comeco || !data_fim
		|| joi.object().instance(Date)
			.validate(data_comeco).error
		|| joi.object().instance(Date)
			.validate(data_fim).error)
		throw new customError(
			'A data de começo e fim 
		);
	*/

	if(!secoes 
		|| joi.array().items(
			joi.string(), joi.array().items(
				joi.string()
			)
		).validate(secoes).error)
		throw new customError(
			'O vetor contendo o formulário é inválido.',
			300
		);
		

	/* Após checagem */

	const client = await db.getClient();

	try {

		await client.query('BEGIN');

		const { rows } =
			await db.query(
				`SELECT id FROM
					formulario
				WHERE fk_proj = $1`,
				[ id ]
			);

		if(rows.length >= 1)
			throw new customError(
				'Já há um formulário cadastrado para esse projeto e apenas um formulário por projeto pode existir.',
				301
			);

		const queryres = await client.query(
			`INSERT INTO
				formulario
			VALUES(
				DEFAULT,
				$1,
				$2,
				$3
			) RETURNING id;`,
			[ 
				id,
				data_comeco,
				data_fim
			]
		);

		const id_form = queryres.rows[0].id;
		const len_sec = secoes.length;

		for(let i=0;i<len_sec;i+=2){

			const queryres2 = await client.query(
				`INSERT INTO
					secao_quest
				VALUES(
					DEFAULT,
					$1,
					$2
				) RETURNING id;`,
				[ id_form, secoes[i] ]
			);

			const id_secao = queryres2.rows[0].id;
			const len_ques = secoes[i+1].length;

			for(let j=0;j<len_ques;j++)
				await client.query(
					`INSERT INTO
						quesito
					VALUES(
						DEFAULT,
						$1,
						$2
					);`,
					[ id_secao, secoes[i+1][j] ]
				);

		}

		await client.query('COMMIT');
		client.release();

		return;
		
	} catch(e) {

		await client.query('ROLLBACK');
		client.release();
		throw e;

	}

}

async function get_formularios_cadastrados(id_proj){
	try {

		/* Checagem de dados */

		if(!id_proj 
			|| joi.number().integer().positive()
				.validate(id_proj).error)
			throw new customError(
				'O identificador de projeto precisa ser um número inteiro e positivo.',
				300
			);

		/* Após checagem */
		const query_id_form = await db.query(
			`SELECT f.id FROM
				formulario AS f
			INNER JOIN
				projeto AS p
			ON f.fk_proj = p.id
			WHERE p.id = $1;`,
			[ id_proj ]
		);
		console.log(query_id_form);
		if(query_id_form.rows.length <= 0)
			return [];
		const id_form = query_id_form.rows[0].id;
		const query_secao_quest = await db.query(
			`SELECT sq.id, sq.nome_sec FROM
				secao_quest AS sq
			INNER JOIN formulario AS f
			ON sq.fk_form = f.id
			WHERE f.id = $1;`,
			[ id_form ]
		);
		console.log(query_secao_quest.rows);
		let form = [];
		let form_i = 0;
		const secoes = query_secao_quest.rows;
		for(let i=0;i<secoes.length;i++){
			const query_quesito = await db.query(
				`SELECT q.pergunta FROM
					quesito AS q
				INNER JOIN secao_quest AS sq
				ON q.fk_secao = sq.id
				WHERE sq.id = $1;`,
				[ secoes[i].id ]
			);
			console.log(query_quesito.rows);
			form[form_i++] = secoes[i].nome_sec;
			form[form_i++] = query_quesito.rows;
		}
		console.log(form);
		return form;
	} catch(e){
		throw e;
	}
}

module.exports = {

	post_formularios_cadastrados,
	get_formularios_cadastrados

};
