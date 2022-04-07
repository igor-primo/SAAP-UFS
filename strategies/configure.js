const passport = require('passport');

function configure(){

	passport.use(JwtStrategy);

	passport.serializeUser(function(user, done){
		return done(null, user);
	});

	passport.deserializeUser(function(obj, done){
		return done(null, obj);
	});

	return { 
		initialize: function(){ return passport.initialize();},
		authenticate: function(strategy, opts){ 
			return passport.authenticate(strategy, opts);
		},
	}

}

module.exports = { configure };
