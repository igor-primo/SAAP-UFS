import BASE_URL from './url.js';
const disciplina = JSON.parse(sessionStorage.getItem('disc'));
const user_creds = JSON.parse(sessionStorage.getItem('user_creds'));
console.log(disciplina);

const cadastro_projeto_form = document.getElementById('cadastro_projeto_form');
cadastro_projeto_form.addEventListener('submit', post_projetos);

async function post_projetos(e){
	e.preventDefault();
	const id_disc = disciplina.id;
	const nome = document.getElementById('nome_proj').value;
	const is_indiv = document.getElementById('is_indiv').checked;
	const cal_sel = document.getElementById('is_pond');
	const is_pond = cal_sel.options[cal_sel.selectedIndex].text == 'Ponderada';
	const peso_prof = document.getElementById('peso_prof').value || null;
	const peso_alun = document.getElementById('peso_alun').value || null;
	const data_apres = new Date(document.getElementById('date').value);
	const token = user_creds.token;
	
	console.log(
		id_disc,
		nome,
		is_indiv,
		is_pond,
		peso_prof,
		peso_alun,
		data_apres
	);

	const opt ={
		method: 'POST',
		body: JSON.stringify({
				id_disc,
				nome,
				is_indiv,
				is_pond,
				peso_prof,
				peso_alun,
				data_apres
			}),
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer "+token
		}
	};
	await fetch(
		`${BASE_URL}/api/v1/projeto/${id_disc}/disciplina`,
		opt
	).then(async data => {
		const data_json = await data.json();
		console.log(data_json);
		if(data_json.msg)
			alert(data_json.msg);
		else
			alert('Projeto cadastrado com sucesso.');
	});

}
