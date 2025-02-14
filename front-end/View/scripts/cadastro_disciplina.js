import BASE_URL from './url.js';
const button = document.getElementById('cadastrar_disciplina_button');
console.log(button);

button.addEventListener('click', handle_submit);

async function handle_submit(e){
	e.preventDefault();
	const user_creds = JSON.parse(sessionStorage.getItem('user_creds'));
	const token = user_creds.token;
	const nome_disc = document.getElementById('name_input').value;
	console.log(nome_disc);
	const opt = {
		method: 'POST',
		body: JSON.stringify({nome_disc}),
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer "+token
		}
	};
	console.log(opt);
	await fetch(
		`${BASE_URL}/api/v1/disciplina`, opt
	).then(async data => {
		const data_json = await data.json();
		if(data_json.msg)
			alert(data_json.msg);
		else
			alert('Discplina cadastrada com sucesso.');
	})
}
