const db = require('../db');
const {customError} = require('../errors/custom');
const joi = require('joi');

async function get_projetos_cadastrados(id){

	try {

		/* Checagem de dados */

		if(!id
			|| joi.number().integer().positive()
					.validate(id).error)
			throw new customError(
				'O identificador de disciplina precisa ser um número inteiro positivo.',
				300
			);

		/* Após checagem */

		const queryres = await db.query(
			`SELECT id, nome, data_apres, is_pond, peso_prof, peso_alun FROM
				projeto
			WHERE
				fk_disc = $1`,
			[ id ]
		);
		
		return queryres.rows;

	} catch(e) {

		throw e;

	}

}

async function post_projetos_cadastrados(
	id_disc,
	nome,
	is_indiv,
	is_pond,
	peso_prof,
	peso_alun,
	data_apres,
	id_us
){

	const client = await db.getClient();

	try {

		/* Checagem de dados */

		if(!id_disc
			|| joi.number().integer().positive()
					.validate(id_disc).error)
			throw new customError(
				'O identificador de disciplina precisa ser um número inteiro positivo.',
				300
			);

		if(!nome 
			|| joi.string().min(1).max(20)
					.validate(nome).error)
			throw new customError(
				'O nome do projeto precisa ter no mínimo 1 caracter e no máximo 20 caracteres.',
				300
			);

		if(!(is_indiv == true) || !(is_indiv == false)
			|| !(is_pond == true) || !(is_pond == false))
			throw new customError(
				'O projeto precisa ser individual ou em grupo e a nota deve ser aritmética ou ponderada.',
				300
			);

		if(is_pond === true
			&& (!peso_prof 
					|| !peso_alun))
			throw new customError(
				'A nota deve ser ponderada mas os algum dos pesos não foram fornecidos.',
				300
			);

		if(!data_apres
			|| joi.object().instance(Date)
				.validate(data_apres).error)
			throw new customError(
				'A data de apresentação é inválida.',
				300
			);

		/* Após checagem */
			

		const queryres = await client.query(
			`INSERT INTO
				projeto
			VALUES(
				DEFAULT,
				$1,
				$2,
				$3,
				$4,
				$5,
				$6,
				$7
			) RETURNING id, nome;`,
				[
					nome,
					id_disc,
					is_indiv,
					is_pond,
					peso_prof,
					peso_alun,
					data_apres
				]
		);
		const id_proj = queryres.rows[0].id;
		await client.query(
			`INSERT INTO
				avaliador
			VALUES(
				$1,
				$2
			);`,
			[ id_us, id_proj ]
		);

		client.query('COMMIT');
		client.release();

		return queryres.rows[0];

	} catch(e) {

		client.query('ROLLBACK');
		client.release();
		throw e;

	}


}

module.exports = {

	get_projetos_cadastrados,
	post_projetos_cadastrados

};
