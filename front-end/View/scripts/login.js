import BASE_URL from './url.js';
console.log(BASE_URL);
const form = document.getElementById('loginForm');
console.log(form);
form.addEventListener('submit', handle_submit);

async function handle_submit(e){
	e.preventDefault();
	const email = document.getElementsByName('email')[0].value;
	const password = document.getElementsByName('password')[0].value;
	console.log(email, password);
	const opt = {
		body: JSON.stringify({email, password}),
		method: 'POST',
			headers: {
					"Content-Type": "application/json"
			},
	};
	console.log(opt);
	await fetch(
		`${BASE_URL}/api/v1/auth/login`, 
		opt
		).then(async data => {
				const data_json = await data.json();
				console.log(data_json);
				if(data_json.msg)
						alert(data_json.msg);
				else{
					const token = data_json.token;
					console.log(token);
					sessionStorage.setItem('user_creds', JSON.stringify(data_json));
					window.location = `/front-end/View/PaginaPrincipal.html`;
				}
		});
}
