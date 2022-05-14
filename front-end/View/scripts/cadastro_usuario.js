import BASE_URL from './url.js';
const form = document.getElementById('cadastroUsuario');
form.addEventListener('submit', handle_submit);

async function handle_submit(e){
	e.preventDefault();
	const username = document.getElementsByName("username")[0].value;
	const password = document.getElementsByName("password")[0].value;
	const email = document.getElementsByName("email")[0].value;
	const matricula = document.getElementsByName("matricula")[0].value;
	//const professor = document.getElementById("exampleRadios1").checked;
	const is_aluno = document.getElementById("exampleRadios2").checked;
	console.log(username, password, email, matricula, is_aluno);
	const opt = {
		method: 'POST',
		body: JSON.stringify({
				username,
				password,
				email,
				matricula,
				is_aluno
			}),
		headers: {
			"Content-Type": "application/json"
		},
	};
		console.log(opt);
	await fetch(
		`${BASE_URL}/api/v1/auth/signup`,
		opt
	).then(async data => {
			const data_json = await data.json();
			console.log(data_json);
			if(data_json.msg)
				alert(data_json.msg);
			else{
				alert('Usuário cadastrado com sucesso. Pode-se logar.');
				window.location = `/front-end/View/Login.html`;
			}
		});
}
