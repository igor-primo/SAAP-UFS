const db = require('../db');
const bcrypt = require('bcryptjs');
const {customError} = require('../errors/custom');
const {JWTissuer} = require('../strategies/jwt-issuer');

async function get_resultado(){
	try {
		const { rows } =
			await db.query(
				`SELECT resultado FROM
					resultado
				WHERE fk_grupo = $1;`,
				[ id_gru ]
			);
		return rows[0];
	} catch(e) {
		throw e;
	}
}

async function post_resultado(id_gru){
	try {
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
					[ id_grupo ]
				);
			const rows = notas_query.rows;
			let count_pesos = 0;
			for(let i=0;i<rows.length;i++){
				const peso = is_aluno == true ?
					peso_alun : peso_prof;
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
