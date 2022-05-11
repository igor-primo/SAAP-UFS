const db = require('../db');
const bcrypt = require('bcryptjs');
const {customError} = require('../errors/custom');

async function get_avaliadaores(id_gru){

	try {

		const { rows } =
			await db.query(
				`SELECT us.id, us.username FROM
					usuario AS us
				INNER JOIN avaliador AS av
				ON us.id = av.fk_id_us
				INNER JOIN projeto AS pr
				ON pr.id = av.fk_id_proj
				INNER JOIN grupo AS gr
				ON gr.fk_proj = pr.id
				WHERE gr.fk_proj != $1`,
				[ id_gru ]
			);

		console.log(rows);

		return rows;

	} catch(e) {

		throw e;

	}

}

module.exports = {

	get_avaliadores

};
