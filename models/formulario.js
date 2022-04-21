const db = require('../db');
const {customError} = require('../errors/custom');

async function post_formularios_cadastrados(
	id,
	data_comeco,
	data_fim,
	secoes,
){

	const client = await db.getClient();

	try {

		await client.query('BEGIN');

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

module.exports = {

	post_formularios_cadastrados

};
