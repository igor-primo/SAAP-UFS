const user_creds = JSON.parse(sessionStorage.getItem('user_creds'));
const proj = JSON.parse(sessionStorage.getItem('proj'));
const cadastro_grupo_form = document.getElementById('cadastro_grupo_form');
cadastro_grupo_form.addEventListener('submit', post_grupo);

async function post_grupo(e){
	e.preventDefault();
	const nome = document.getElementById('nome_grupo').value;
	const tema = document.getElementById('tema_grupo').value;
	const id_proj = proj.id;
	const token = user_creds.token;
	const opt = {
		method: 'POST',
		headers: {
			"Authorization": "Bearer "+token,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({nome, tema})
	};
	await fetch(
		`http://127.0.0.1:5000/api/v1/grupo/${id_proj}/projeto`,
		opt
	).then(async data => {
		const data_json = await data.json();
		if(data_json.msg)
			alert(data_json.msg);
		else
			alert('Grupo cadastrado com sucesso');
	});
}
