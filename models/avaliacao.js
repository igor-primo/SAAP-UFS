const db = require('../db');
const bcrypt = require('bcryptjs');
const {customError} = require('../errors/custom');
const joi = require('joi');

async function post_avaliacao(id_av, id_gru, nota){
	try {

		/* Checagem de dados */
		if(!id_av || !id_gru
			|| !nota)
			throw new customError(
				'Algum dado não foi informado.',
				300
			);

		if(joi.number().integer().positive().validate(id_av).error
			|| joi.number().integer().positive().validate(id_gru).error)
			throw new customError(
				'O identificador de avaliador e de grupo precisam ser números interios positivos.',
				300
			);

		if(joi.number().positive().validate(nota).error)
			throw new customError(
				'A nota precisa ser um número positivo.',
				300
			);

		/* Após checagem */


		/* 1 pessoa não pode avaliar mais de uma vez */
		const { rows } =
			await db.query(
				`SELECT fk_avaliador
					FROM avaliacao
				WHERE fk_grupo = $1
					AND fk_avaliador = $2;`,
				[ id_gru, id_av ]
			);
		if(rows.length > 0)
			throw new customError(
				'Um avaliador pode avaliar apenas uma vez. Cadastro de avaliacao falhou.',
				300
			);
		/* O avaliador precisa ser de fato avaliador */

		const id_proj_query =
			await db.query(
				`SELECT pr.id
					FROM projeto AS pr
				INNER JOIN grupo AS gr
				ON gr.fk_proj = pr.id
				WHERE gr.id = $1;`,
				[ id_gru ]
			);

		if(id_proj_query.rows.length <= 0)
			throw new customError('', 500);

		const id_proj = id_proj_query.rows[0].id;

		const is_avaliador_query =
			await db.query(
				`SELECT fk_id_us
					FROM avaliador
				WHERE fk_id_us = $1
				AND fk_id_proj = $2;`,
				[ id_av, id_proj ]
			);

		if(is_avaliador_query.rows.length < 1)
			throw new customError(
				'O seu usuário não é avaliador desse projeto.',
				300
			);

		/* E não pode ser integrante */

		const not_integrante_query =
			await db.query(
				`SELECT fk_us
					FROM us_gru
				WHERE fk_us = $1
				AND fk_gru = $2;`,
				[ id_av, id_gru ]
			);

		if(not_integrante_query.rows.length > 0)
			throw new customError(
				'O seu usuário é integrante desse grupo. Por isso não pode avaliar o grupo.',
				300
			);

		/* E tem que estar no período de avaliações */
		const periodo_avaliacao_query =
			await db.query(
				`SELECT iniciado_b, terminado_b
					FROM periodo_avaliacao
				WHERE fk_proj = $1;`,
				[ id_proj ]
			);

		if(periodo_avaliacao_query.rows.length > 0){
			const bools = periodo_avaliacao_query.rows[0];
			if(!bools.iniciado_b)
				throw new customError(
					'O período de avaliação não foi iniciado.',
					300
				);
			if(bools.terminado_b)
				throw new customError(
					'O período de avaliação já terminou.',
					300
				);
		} else
			throw new customError(
				'O projeto desse grupo não possui entrada indicando período de avaliação.',
				300
			);

		await db.query(
			`INSERT INTO
				avaliacao
			VALUES(
				$1,
				$2,
				$3
			);`,
			[ id_av, id_gru, nota ]
		);
	} catch(e){
		throw e;
	}
}

module.exports = {
	post_avaliacao
};
