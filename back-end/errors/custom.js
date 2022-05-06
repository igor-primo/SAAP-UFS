class customError extends Error{

	constructor(message, statusCode){
		
		super(message);
		this.statusCode = statusCode;

	}

}

function createCError(msg, statusCode){

	return new CustomError(msg, statusCode);

}

module.exports = {createCError, customError};
