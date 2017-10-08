import qs from 'querystring'

const request = async (endpoint, params, method = 'GET') => {
	let requestURL = `/api/v1${endpoint}/`;
	let body;
	if (method === 'GET')
		requestURL += `?${qs.encode(params)}`;
	if (method === 'POST')
		body = JSON.stringify(params);
	
	try {
		return fetch(requestURL, {
			method, body, headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `JWT ${localStorage.getItem('token')}`
			}
		});
	}
	catch (error) {
		console.error(error);
	}
};

const registerUser = async () => {
	const token = localStorage.getItem('token');
	if (token)
		return Promise.resolve();
	try {
		const response = await fetch('/api/v1/auth/signup/anonymous', {method: 'POST'});
		if (response.ok) {
			const {token} = await response.json();
			localStorage.setItem('token', token);
		}
		else {
			console.warn('Warning: user registration failed!')
		}
	}
	catch (error) {
		console.error(error);
	}
};

export {
	request,
	registerUser
}