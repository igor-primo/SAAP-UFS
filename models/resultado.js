const db = require('../db');
const {customError} = require('../errors/custom');
const joi = require('joi');

async function get_resultado(id_gru){
	try {

		/* Checagem de dados */

		if(!id_gru
			|| joi.number().integer().positive()
					.validate(id_gru).error)
			throw new customError(
				'O identificador de grupo precisa ser um número inteiro positivo.',
				300
			);

		/* Após checagem */

		const { rows } =
			await db.query(
				`SELECT result FROM
					resultado
				WHERE fk_grupo = $1;`,
				[ id_gru ]
			);
		console.log('resultado');
		console.log(rows);
		return rows;
	} catch(e) {
		throw e;
	}
}

async function post_resultado(id_gru){
	try {
		/* Checagem de dados */

		if(!id_gru
			|| joi.number().integer().positive()
					.validate(id_gru).error)
			throw new customError(
				'O identificador de grupo precisa ser um número inteiro positivo.',
				300
			);

		/* Após checagem */
		const already_done_query =
			await db.query(
				`SELECT id FROM
					resultado
				WHERE fk_grupo = $1;`,
				[ id_gru ]
			);

		if(already_done_query.rows.length > 0)
			throw new customError(
				'Já há um cálculo de resultado para esse grupo e só é permitido um cálculo de resultado por grupo. Abortando.',
				300
			);

		const there_is_avaliacao_query =
			await db.query(
				`SELECT fk_grupo FROM
					avaliacao
				WHERE fk_grupo = $1;`,
				[ id_gru ]
			);

		if(there_is_avaliacao_query.rows.length <= 0)
			throw new customError(
				'Não há uma avaliação cadastrada para esse grupo.',
				300
			);

		const finished_exam_period =
			await db.query(
				`SELECT pa.iniciado_b, pa.terminado_b
					FROM grupo AS g
				INNER JOIN projeto AS p
				ON g.fk_proj = p.id
				INNER JOIN periodo_avaliacao AS pa
				ON pa.fk_proj = p.id
				WHERE g.id = $1;`,
				[ id_gru ]
			);

		if(!finished_exam_period.rows[0].iniciado_b
			|| !finished_exam_period.rows[0].terminado_b)
			throw new customError(
				`Para calcular o resultado é necessário que o período de avaliação tenha terminado.`,
				300
			);

		/* Checagens feitas */

		const pond_info_query =
			await db.query(
				`SELECT pr.is_pond, pr.peso_prof, pr.peso_alun FROM
					projeto AS pr
				INNER JOIN
					grupo AS gr
				ON gr.fk_proj = pr.id
				WHERE gr.id = $1`,
				[ id_gru ]
			);
		const pond_info = pond_info_query.rows[0];
		console.log(pond_info);
		let result = 0;
		if(pond_info.is_pond){
			const notas_query = 
				await db.query(
					`SELECT av.nota, us.is_aluno FROM
						avaliacao AS av
					INNER JOIN
						usuario AS us
					ON av.fk_avaliador = us.id
					WHERE av.fk_grupo = $1;`,
					[ id_gru ]
				);
			const rows = notas_query.rows;
			let count_pesos = 0;
			for(let i=0;i<rows.length;i++){
				const peso = rows[i].is_aluno == true ?
					pond_info.peso_alun : pond_info.peso_prof;
				result += rows[i].nota*peso;
				count_pesos += peso;
			}
			result = result / count_pesos;
		} else {
			const notas_query = 
				await db.query(
					`SELECT nota FROM
						avaliacao
					WHERE fk_grupo = $1;`,
					[ id_gru ]
				);
			const rows = notas_query.rows;
			for(let i=0;i<rows.length;i++)
				result += rows[i].nota;
			result = result / rows.length;
		}
		await db.query(
			`INSERT INTO
				resultado
			VALUES(
				DEFAULT,
				$1,
				$2
			);`,
			[ id_gru, result ]
		);
		return;
	} catch(e){
		throw e;
	}
}

module.exports = {
	get_resultado,
	post_resultado
};
