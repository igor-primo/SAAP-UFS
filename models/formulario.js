const db = require('../db');
const {customError} = require('../errors/custom');

async function post_formularios_cadastrados(
	id,
	data_comeco,
	data_fim,
	secoes,
){

	const client = db.getClient();

	try {

		client.query('BEGIN');

		const id_form = client.query(
			`INSERT INTO
				formulario
			VALUES(
				DEFAULT,
				$1,
				$2,
				$3
			) RETURNING id;`.
			[ 
				id,
				data_comeco,
				data_fim
			]
		);

		const len_sec = secoes.length;

		for(let i=0;i<len_sec;i+=2){

			const id_secao = await client.query(
				`INSERT INTO
					secao_ques
				VALUES(
					DEFAULT,
					$1,
					$2
				) REUTRNING id;`,
				[ id_form, secoes[i] ]
			);

			const len_ques = secoes[i+1].length;

			for(let j=0;j<len_ques;j++)
				await client.query(
					`INSERT INTO
						quesitos
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
