const responseMessages = {
	
	errorResponse: (code, message = '') => { 
		const msg = {
			'status': code,
			'error': message
		};
		return msg;
	},

	successResponse: (code, data = []) => { 
		const msg = {
			'status': code,
			'data': data
		};
		return msg;
	},

	commonResponse: (code, data) => { 
		const msg = {
			'status': code,
			'data': data
		};
		return msg;
	},
};
  
module.exports = responseMessages;