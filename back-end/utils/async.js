function asyncWrapper (fn) {

	return async function(req, res, next){

		try{

			await fn(req, res, next);

		} catch(err){

			console.log('caller: ' + fn);

			next(err);

		}

	}

}

module.exports = asyncWrapper;
