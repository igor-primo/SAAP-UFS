const fs = require('fs');
const passportJwt = require('passport-jwt');
const { Strategy, ExtractJwt } = passportJwt;
const db = require('../db');

const PUB_KEY = process.env.PUBLIC_KEY;

const params = {
	secretOrKey: PUB_KEY,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	algorithm: 'RS256',
}

async function handleStrategy(payload, done){

	try{

		const queryText = db.queries.JWT_STRATEGY(payload.sub);

		const queryRes = await db.query(
			`SELECT id_pessoa FROM usuario
			WHERE id_pessoa = ${id};`
		);

		if(queryRes.rows.length>0)
			done(null, { id: queryRes.rows[0].id_pessoa });
		else
			done(null, false);

	} catch(e){

		return done(null, false);

	}

}

const JwtStrategy = new Strategy(params, handleStrategy);

module.exports = { JwtStrategy };
