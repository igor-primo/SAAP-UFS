const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');

const PRIV_KEY = process.env.PRIVATE_KEY;

function JWTissuer(id){

	const expiresIn = '2w';

	const payload = {
		sub: id,
		iat: Date.now(),
	};

	const signedToken = jsonwebtoken.sign(payload, PRIV_KEY,
		{expiresIn: expiresIn, algorithm: 'RS256'});

	return signedToken;
}

module.exports = { JWTissuer };
