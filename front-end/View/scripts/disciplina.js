import BASE_URL from './url.js';
const disciplina = JSON.parse(sessionStorage.getItem('disc'));
const user_creds = JSON.parse(sessionStorage.getItem('user_creds'));
console.log('disciplina', disciplina);

let projetos = [];
let alunos = [];
let professores = [];
let integrantes = [];

async function get_projetos(){
	const id_disc = disciplina.id;
	const token = user_creds.token;
	const opt = {
		method: 'GET',
		headers:{
			"Content-Type": "application/json",
			"Authorization": "Bearer "+token
		}
	};
	await fetch(
		`${BASE_URL}/api/v1/projeto/${id_disc}/disciplina`,
		opt
	).then(async data => {
		projetos = await data.json();
		console.log('projetos', projetos);
		for(let i=0;i<projetos.length;i++){
			const nome = projetos[i].nome;
			const data = new Date(projetos[i].data_apres);
			const ano = data.getFullYear();
			const mes = data.getMonth() + 1;
			const dia = data.getDate();
			const data_apres = `${dia}/${mes}/${ano}`;
			const projetos_el = document.createElement('div');
			projetos_el.setAttribute('id', projetos[i].id);
			projetos_el.setAttribute('class', 'card w-50 text-center center-block cardProjeto');
			projetos_el.innerHTML = `
					<div class="card-body">
						<h5 class="card-title">${nome}</h5>
						<p class="card-text">Início das apresentações: ${data_apres}</p>
						<a name="entrar_button" href="Projeto.html" class="btn btn-primary">Entrar</a>
					</div>
			`;
			document.getElementById('Projetos').appendChild(projetos_el);
			console.log(projetos_el);
		}
		document.getElementById('nome_disciplina').innerHTML = `Disciplina: ${disciplina.nome_disc}`;
	});

	const entrar_button = document.getElementsByName('entrar_button');
	for(let i=0;i<entrar_button.length;i++)
		entrar_button[i].addEventListener('click', entrar_projeto);

}

function entrar_projeto(e){
	const element = e.srcElement.parentNode.parentNode;
	const id = element.id;
	for(let i=0;i<projetos.length;i++)
		if(id == projetos[i].id)
			sessionStorage.setItem('proj', JSON.stringify(projetos[i]));
}

async function get_alunos(){
	const token = user_creds.token;
	const is_aluno = true;
	const opt = {
		method: 'POST',
		headers: {
			"Authorization": "Bearer "+token,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({is_aluno})
	};
	await fetch(
		`${BASE_URL}/api/v1/usuario`,
		opt
	).then(async data => {
		alunos = await data.json();
		console.log('alunos', alunos);
		if(alunos.msg)
			alert(alunos.msg);
		const corpo_tabela_integrantes =
			document.getElementById('lista_alunos');
		for(let i=0;i<alunos.length;i++){
			if(integrantes_includes(alunos[i])) 
				continue;
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

		const enviar_alunos_button = 
			document.getElementById('enviar_alunos_button');
		enviar_alunos_button.addEventListener('click', post_alunos);
		
		async function post_alunos(e){
			e.preventDefault();
			const checkboxes =
				document.getElementsByName('post_alunos_checkbox');
			let id_us_arr = [];
			console.log(checkboxes); //nodelist
			for(let i=0;i<checkboxes.length;i++)
				if(checkboxes[i].checked)
					id_us_arr.push(checkboxes[i].id);
			const disc_id = disciplina.id;
			const opt = {
				method: 'POST',
				body: JSON.stringify({id_us_arr, disc_id}),
				headers: {
					"Authorization": "Bearer "+token,
					"Content-Type": "application/json"
				}
			};
			console.log(id_us_arr, disc_id, opt);
			await fetch(
				`${BASE_URL}/api/v1/disciplina/cadastrar_usuario`,
				opt
			).then(async data => {
				const data_json = await data.json();
				console.log(data_json);
				if(data_json.msg)
					alert(data_json.msg)
				else
					alert('Alunos cadastrados em disciplina com sucesso.');
			});
		}
		

	});
}

async function get_professores(){
	const token = user_creds.token;
	const is_aluno = false;
	const opt = {
		method: 'POST',
		headers: {
			"Authorization": "Bearer "+token,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({is_aluno})
	};
	await fetch(
		`${BASE_URL}/api/v1/usuario`,
		opt
	).then(async data => {
		professores = await data.json();
		console.log(professores);
		if(professores.msg)
			alert(professores.msg);
		const corpo_tabela_integrantes =
			document.getElementById('lista_professores');
		for(let i=0;i<professores.length;i++){
			if(professores[i].id == user_creds.id) continue;
			const checkbox = document.createElement('input');
			console.log(professores[i]);
			checkbox.setAttribute('type', 'checkbox');
			checkbox.setAttribute('class', 'custom-control-input');
			checkbox.setAttribute('id', professores[i].id);
			checkbox.setAttribute('name', 'post_professores_checkbox');
			const th = document.createElement('th');
			th.setAttribute('scope', 'row');
			th.appendChild(checkbox);
			const td1 = document.createElement('td');
			td1.innerHTML = `${professores[i].username}`;
			const td2 = document.createElement('td');
			td2.innerHTML = `${professores[i].username}`;
			const tr = document.createElement('tr');
			tr.appendChild(th);
			tr.appendChild(td1);
			tr.appendChild(td2);
			corpo_tabela_integrantes.appendChild(tr);
		}

		const enviar_professores_button = 
			document.getElementById('enviar_professores_button');
		enviar_professores_button.addEventListener('click', post_professores);
		
		async function post_professores(e){
			e.preventDefault();
			const checkboxes =
				document.getElementsByName('post_professores_checkbox');
			console.log(checkboxes);
			let id_us_arr = [];
			for(let i=0;i<checkboxes.length;i++)
				if(checkboxes[i].checked)
					id_us_arr.push(checkboxes[i].id);
			const disc_id = disciplina.id;
			const opt = {
				method: 'POST',
				body: JSON.stringify({id_us_arr, disc_id}),
				headers: {
					"Authorization": "Bearer "+token,
					"Content-Type": "application/json"
				}
			};
			await fetch(
				`${BASE_URL}/api/v1/disciplina/cadastrar_usuario`,
				opt
			).then(async data => {
				const data_json = await data.json();
				console.log(data_json);
				if(data_json.msg)
					alert(data_json.msg)
				else
					alert('Professores cadastrados em disciplina com sucesso.');
			});
		}


	});
}

async function get_integrantes(){
	const token = user_creds.token;
	const disc_id = disciplina.id;
	const opt = {
		method: 'GET',
		headers: {
			"Authorization": "Bearer "+token,
			"Content-Type": "application/json"
		}
	};
	await fetch(
		`${BASE_URL}/api/v1/disciplina/${disc_id}/get_integrantes`,
		opt
	).then(async data => {
		integrantes = await data.json();
		if(integrantes.msg)
			alert(integrantes.msg);
		console.log('integrantes', integrantes);
		const tabela_integrantes_alunos =
			document.getElementById('tabela_integrantes_alunos');
		const tabela_integrantes_professores =
			document.getElementById('tabela_integrantes_professores');
		for(let i=0;i<integrantes.length;i++){
			const tr = 
				document.createElement('tr');
			tr.innerHTML = 
				`
				<th scope="row">1</th>
				<td>${integrantes[i].username}</td>
				<td>${integrantes[i].username}</td>
				<td style="cursor: pointer;"><span class="material-icons-outlined btnRemover"
						onclick="apagarProfessor(this.parentNode.parentNode.rowIndex)">close</span></td>
				`;
			if(integrantes[i].is_aluno)
				tabela_integrantes_alunos.appendChild(tr);
			else
				tabela_integrantes_professores.appendChild(tr);
		}
		sessionStorage.setItem('list_integrantes', JSON.stringify(integrantes));
	});
}

function render_conditionals(){
	if(!user_creds.is_aluno){
		const cadastrar_projeto =
			document.createElement('a');
		cadastrar_projeto.setAttribute('class', 'dropdown-item');
		cadastrar_projeto.setAttribute('href', 'CadastroProjeto.html');
		cadastrar_projeto.innerHTML = 'Cadastrar projeto';
		const adicionar_aluno =
			document.createElement('a');
		adicionar_aluno.setAttribute('class', 'dropdown-item');
		adicionar_aluno.setAttribute('href', '#alunosModal');
		adicionar_aluno.setAttribute('data-bs-toggle', 'modal');
		adicionar_aluno.innerHTML = 'Adicionar alunos';
		const adicionar_professor =
			document.createElement('a');
		adicionar_professor.setAttribute('class', 'dropdown-item');
		adicionar_professor.setAttribute('href', '#professoresModal');
		adicionar_professor.setAttribute('data-bs-toggle', 'modal');
		adicionar_professor.innerHTML = 'Adicionar professores';
		const li3 = document.createElement('li');
		li3.appendChild(adicionar_professor);
		const li2 = document.createElement('li');
		li2.appendChild(adicionar_aluno);
		const li1 = document.createElement('li');
		li1.appendChild(cadastrar_projeto);
		const lo = document.getElementById('lista_opcoes');
		lo.insertBefore(
			li1,
			document.getElementById('li_integrantes')
		);
		lo.insertBefore(
			li2,
			document.getElementById('li_integrantes')
		);
		lo.insertBefore(
			li3,
			document.getElementById('li_integrantes')
		);
	}
}

function integrantes_includes(aluno){
	for(let i=0;i<integrantes.length;i++)
		if(integrantes[i].id == aluno.id)
			return true;
	return false;
}

await get_projetos();
await get_integrantes();
await get_alunos();
await get_professores();
render_conditionals();
