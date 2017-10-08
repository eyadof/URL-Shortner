module.exports = {
	parameterRequired(paramName) {
		return {
			code: 100,
			status: 400,
			message: `${paramName} is required.`
		}
	},
	parameterInvalid(paramName) {
		return {
			code: 101,
			status: 400,
			message: `${paramName} invalid.`
		}
	},
	parameterUsed(paramName, paramValue) {
		return {
			code: 102,
			status: 400,
			message: `${paramName}: ${paramValue} already exists.`
		}
	},
	forbidden() {
		return {
			code: 103,
			status: 403,
			message: 'you can not access this resource.'
		}
	},
	internalError() {
		return {
			code: 103,
			status: 500,
			message: 'Oops! Please try again later.'
		}
	},
	invalidCredentials() {
		return {
			code: 104,
			status: 401,
			message: 'please check your email/password.'
		}
	}
};