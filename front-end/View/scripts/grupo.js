import BASE_URL from './url.js';
const grupo = JSON.parse(sessionStorage.getItem('grupo'));
const proj = JSON.parse(sessionStorage.getItem('proj'));
const user_creds = JSON.parse(sessionStorage.getItem('user_creds'));
const disciplina = JSON.parse(sessionStorage.getItem('disc'));
console.log(grupo);
console.log(proj);

document.getElementById('grupo_nome').innerHTML = `Grupo: ${grupo.nome}`;
document.getElementById('grupo_tema').innerHTML = `${grupo.tema}`;

//const adicionar_integrantes = document.getElementById('');
//const doc = document.getElementsByTagName('body')[0];
//doc.addEventListener('onload', get_alunos);

let integrantes = [];
let alunos = [];

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
		`${BASE_URL}/api/v1/usuario`,
		opt
	).then(async data => {
		alunos = await data.json();
		console.log(alunos);
		const corpo_tabela_integrantes =
			document.getElementById('corpo_tabela_integrantes');
		for(let i=0;i<alunos.length;i++){
			if(integrantes_includes(alunos[i])) continue;
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
		`${BASE_URL}/api/v1/grupo/post_integrantes`,
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
		`${BASE_URL}/api/v1/grupo/${id_gru}/integrantes`,
		opt
	).then(async data => {
		integrantes = await data.json();
		console.log(integrantes);
		let str = '';
		let i = 0;
		if(integrantes.length != 0){
			for(;i<integrantes.length - 1;i++)
				str += integrantes[i].username + ', ';
			str += integrantes[i].username;
		}
		document.getElementById('integrantes_lista')
			.innerHTML = `${str}`;
	});
}

async function post_resultado(e){
	e.preventDefault();
	const token = user_creds.token;
	const id_gru = grupo.id;
	const opt = {
		method: 'POST',
		body: JSON.stringify({id_gru}),
		headers: {
			"Authorization": "Bearer "+token,
			"Content-Type": "application/json"
		}
	};
	await fetch(
		`${BASE_URL}/api/v1/resultado`,
		opt
	).then(async data => {
		const data_json = await data.json();
		if(data_json.msg)
			alert(data_json.msg);
		else
			alert('Resultado calculado com sucesso.');
	});
}

async function get_resultado(){
	const token = user_creds.token;
	const id_gru = grupo.id;
	const opt = {
		method: 'GET',
		headers: {
			"Authorization": "Bearer "+token
		}
	};
	await fetch(
		`${BASE_URL}/api/v1/resultado/get_resultado/${id_gru}`,
		opt
	).then(async data => {
		const resultado = await data.json();
		if(resultado.msg)
			alert(resultado.msg);
		else{
			const resultado_p =
				document.getElementById('resultado_p');
			console.log(resultado);
			if(resultado.length > 0)
				if(proj.is_pond)
					resultado_p.innerHTML = `Ponderada: ${resultado[0].result} (Peso do professor: ${proj.peso_prof}) | (Peso do aluno: ${proj.peso_alun})`;
				else
					resultado_p.innerHTML = `Aritmética: ${resultado[0].result}`;
			else
				resultado_p.innerHTML = 'Não calculado.';
		}
	});
}

function render_conditionals(){
	if(!user_creds.is_aluno && disciplina.prof_resp == user_creds.id){
		/* Botão para calcular o resultado */
		const corpo = document.getElementById('corpo');
		const bu = document.createElement('button');
		bu.setAttribute('id', 'calcular_resultado_button');
		bu.setAttribute('type', 'button');
		bu.setAttribute('class', 'btn btn-primary ');
		bu.innerHTML = 'Calcular resultado';
		const div = document.createElement('div');
		div.setAttribute('class', 'text-end');
		div.appendChild(bu);
		corpo.insertBefore(
			bu,
			document.getElementById('grupo_nome')
		);
		/* Lista de opções */
		const li = document.createElement('li');
		li.setAttribute('class', 'nav-item dropstart');
		li.innerHTML = 
			`
				<a class="nav-link dropdown-toggle active" href="#" id="navbarDropdown" role="button"
					data-bs-toggle="dropdown" aria-expanded="false">Opções
				</a>
				<ul class="dropdown-menu" aria-labelledby="navbarDropdown">
					<!-- <li><a class="dropdown-item" href="#">Editar Grupo</a></li> -->
					<li><a id="adicionar_integrantes" class="dropdown-item" href="#adicionarIntegrantesModal" data-bs-toggle="modal">Adicionar integrantes</a>
					</li>
					<!-- <li><a class="dropdown-item" href="#integrantesModal" data-bs-toggle="modal">Integrantes</a></li> -->
					<!-- <li>
						<hr class="dropdown-divider">
					</li> -->
				</ul>
			`;
		const lista_lista = document.getElementById('lista_lista');
		lista_lista.insertBefore(li, document.getElementById('li_perfil'));
	}
}

function integrantes_includes(aluno){
	for(let i=0;i<integrantes.length;i++)
		if(integrantes[i].id == aluno.id)
			return true;
	return false;
}

await get_integrantes();
await get_alunos();
await get_resultado();
render_conditionals();
const adicionar_integrantes_button = 
	document.getElementById('adicionar_integrantes_button');
adicionar_integrantes_button.addEventListener('click', post_integrantes);
const calcular_resultado_button =
	document.getElementById('calcular_resultado_button');
calcular_resultado_button.addEventListener('click', post_resultado)
