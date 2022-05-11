const grupo = JSON.parse(sessionStorage.getItem('grupo'));
const user_creds = JSON.parse(sessionStorage.getItem('user_creds'));
console.log(grupo);

document.getElementById('grupo_nome').innerHTML = `Grupo: ${grupo.nome}`;
document.getElementById('grupo_tema').innerHTML = `${grupo.tema}`;

//const adicionar_integrantes = document.getElementById('');
//const doc = document.getElementsByTagName('body')[0];
//doc.addEventListener('onload', get_alunos);

async function get_alunos(){ /* construir tabela de alunos */
	//e.preventDefault();
	console.log('what');
	const token = user_creds.token;
	const is_aluno = true;
	const opt = {
		method: 'POST',
		body: JSON.stringify({is_aluno}),
		headers: {
			"Authorization": "Bearer "+token,
			"Content-Type": "application/json"
		}
	};
	console.log(opt);
	await fetch(
		'http://127.0.0.1:5000/api/v1/usuario',
		opt
	).then(async data => {
		const alunos = await data.json();
		console.log(alunos);
		const corpo_tabela_integrantes =
			document.getElementById('corpo_tabela_integrantes');
		for(let i=0;i<alunos.length;i++){
			const checkbox = document.createElement('input');
			console.log(alunos[i]);
			checkbox.setAttribute('type', 'checkbox');
			checkbox.setAttribute('class', 'custom-control-input');
			checkbox.setAttribute('id', alunos[i].id);
			checkbox.setAttribute('name', 'post_alunos_checkbox');
			const th = document.createElement('th');
			th.setAttribute('scope', 'row');
			th.appendChild(checkbox);
			const td1 = document.createElement('td');
			td1.innerHTML = `${alunos[i].username}`;
			const td2 = document.createElement('td');
			td2.innerHTML = `${alunos[i].username}`;
			const tr = document.createElement('tr');
			tr.appendChild(th);
			tr.appendChild(td1);
			tr.appendChild(td2);
			corpo_tabela_integrantes.appendChild(tr);
		}
	});
}

async function post_integrantes(e){
	e.preventDefault();
	const token = user_creds.token;
	const inputs =
		document.getElementsByName('post_alunos_checkbox');
	console.log(inputs);
	let id_us_arr = [];
	for(let i=0;i<inputs.length;i++)
		if(inputs[i].checked)
			id_us_arr.push(inputs[i].id);
	console.log(id_us_arr);
	const id_gru = grupo.id;
	const body = {id_gru, id_us_arr};
	const opt = {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			"Authorization": "Bearer "+token,
			"Content-Type": "application/json"
		}
	};
	console.log(opt);
	await fetch(
		'http://127.0.0.1:5000/api/v1/grupo/post_integrantes',
		opt
	).then(async data => {
		const data_json = await data.json();
		console.log(data_json);
		if(data_json.msg)
			alert(data_json.msg);
		else
			alert('Integrantes adicionados com sucesso.');
	});
}

async function get_integrantes(){
	const token = user_creds.token;
	const id_gru = grupo.id;
	console.log(id_gru);

	const opt = {
		method: 'GET',
		headers: {
			"Authorization": "Bearer "+token
		}
	};
	console.log(opt);
	await fetch(
		`http://127.0.0.1:5000/api/v1/grupo/${id_gru}/integrantes`,
		opt
	).then(async data => {
		const integrantes = await data.json();
		console.log(integrantes);
		let str = '';
		let i = 0;
		for(;i<integrantes.length - 1;i++)
			str += integrantes[i].username + ', ';
		str += integrantes[i].username;
		document.getElementById('integrantes_lista')
			.innerHTML = `${str}`;
	});
}

get_alunos();
get_integrantes();
const adicionar_integrantes_button = 
	document.getElementById('adicionar_integrantes_button');
adicionar_integrantes_button.addEventListener('click', post_integrantes);
