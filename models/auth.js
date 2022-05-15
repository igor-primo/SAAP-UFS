const db = require('../db');
const bcrypt = require('bcryptjs');
const {customError} = require('../errors/custom');
const {JWTissuer} = require('../strategies/jwt-issuer');
const joi = require('joi');

async function signup (
	username, 
	password, 
	email,
	matricula,
	is_aluno
){

	try {

		/* Checagem de dados */

		if(!username || !password
			|| !email || !matricula)
			throw new customError(
				'Algum dos dados de entrada estão vazios.',
				300
			);

		if(!(is_aluno == true) 
			|| !(is_aluno == false))
			throw new customError(
				'O usuário deve ser professor ou aluno.',
				300
			);

		if(joi.string().min(8).max(20).validate(password).error)
			throw new customError(
				'A senha precisa ter no mínimo 8 e no máximo 20 caracteres.',
				300
			);

		if(joi.string().min(8).max(60).validate(username).error)
			throw new customError(
				'O nome precisa ter no mínimo 8 e no máximo 60 caracteres.',
				300
			);


		if(joi.string().email().validate(email).error)
			throw new customError(
				'O e-email é inválido.',
				300
			);

		if(joi.string().pattern(/^[0-9]+$/).validate(matricula).error)
			throw new customError(
				'A matrícula pode conter apenas números.',
				300
			);

		/* Após checagens */

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
				$3,
				$4,
				$5
			);`,
			[ 
				username, 
				hash, 
				email,
				matricula, 
				is_aluno
			]
		);

		return {
			jaCadastrado: false,
		};

	} catch(e) {
		
		throw e;

	}

}

async function login (email, password){

	try {

		/* Checagem de dados */

		if(!email || !password)
			throw new customError(
				'Campos incompletos',
				400
			);

		if(joi.string().email().validate(email).error)
			throw new customError(
				'O e-mail é inválido.',
				300
			);

		if(joi.string().min(8).max(20).validate(password).error)
			throw new customError(
				'A senha precisa ter no mínimo 8 e no máximo 20 caracteres.',
				300
			);

		/* após checagem */

		const queryres = await db.query(
			`SELECT id, username, email, matricula, is_aluno, password
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
			const id = queryres.rows[0].id;
			const username = queryres.rows[0].username;
			const email = queryres.rows[0].email;
			const matricula = queryres.rows[0].matricula;
			const is_aluno = queryres.rows[0].is_aluno;

			return { id, username, email, matricula, is_aluno, token };

		}

	} catch(e) {

		throw e;

	}

}


module.exports = {
	signup,
	login,
};
