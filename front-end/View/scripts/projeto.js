import BASE_URL from './url.js';
const projeto = JSON.parse(sessionStorage.getItem('proj'));
const user_creds = JSON.parse(sessionStorage.getItem('user_creds'));
const disciplina = JSON.parse(sessionStorage.getItem('disc'));
console.log(projeto);

document.getElementById('nome_projeto').innerHTML = 
	`Projeto: ${projeto.nome}`;

let grupos = [];

async function get_grupos(){
	const id_proj = projeto.id;
	const token = user_creds.token;
	const opt = {
		method: 'GET',
		headers: {
			"Authorization": "Bearer "+token
		}
	};
	await fetch(
		`${BASE_URL}/api/v1/grupo/${id_proj}/projeto`,
		opt
	).then(async data => {
		grupos = await data.json();
		console.log(grupos);
		const grupos_sec = document.getElementById('Grupos');
		for(let i=0;i<grupos.length;i++){
			const grupo = document.createElement('div');
			grupo.setAttribute('id', grupos[i].id);
			grupo.setAttribute('class', 'card w-50 text-center cardGrupo');
			grupo.innerHTML = `
                <div id="${grupos[i].id}" class="card-body">
                  <h5 class="card-title">Grupo ${grupos[i].nome}</h5>
                  <p class="card-text">Tema: ${grupos[i].tema}</p>
                  <a id="avaliar_button" href="Avaliacao.html" class="btn btn-primary">Avaliar</a>
                  <a id="visualizar_button" href="Grupo.html" class="btn btn-primary m-1">Vizualizar</a>
                </div>
			`;
			grupos_sec.appendChild(grupo);

			const visualizar_button = document.getElementById('visualizar_button');
			visualizar_button.addEventListener('click', handle_visualizar);
			const avaliar_button =
				document.getElementById('avaliar_button');
			avaliar_button.addEventListener('click', handle_visualizar)

			function handle_visualizar(e){
				//e.preventDefault();
				const disc_id = e.srcElement.parentNode.id;
				console.log(disc_id);
				for(let i=0;i<grupos.length;i++)
					if(disc_id == grupos[i].id)
						sessionStorage.setItem('grupo', JSON.stringify(grupos[i]));
			}
		}
	});
}

function render_conditionals(){
	if(!user_creds.is_aluno && disciplina.prof_resp == user_creds.id){
		const li =
			document.createElement('li');
		li.setAttribute('id', 'lista_opcoes');
		li.setAttribute('class', 'nav-item dropstart');
		li.innerHTML = 
			`
			<a class="nav-link dropdown-toggle active" href="#" id="navbarDropdown" role="button"
				data-bs-toggle="dropdown" aria-expanded="false">Opções
			</a>
			<ul class="dropdown-menu" aria-labelledby="navbarDropdown">
				<!-- <li><a class="dropdown-item" href="#">Editar Projeto</a></li> -->
				<li><a class="dropdown-item" href="CadastroGrupo.html">Criar grupo</a></li>
				<li><a class="dropdown-item" href="CadastroFormulario.html">Criar formulário de avaliação</a></li>
				<!-- <li><a class="dropdown-item" href="#">Editar formulário</a></li> -->
				<li><a class="dropdown-item" href="#exampleModal" data-bs-toggle="modal">Convidar
						avaliadores</a></li>
				<li><a class="dropdown-item" href="#avaliadoresModal" data-bs-toggle="modal">Avaliadores</a></li>
				<li><a id="inicializar_periodo" class="dropdown-item" href="#">Iniciar Periodo de avaliação</a></li>
				<li><a id="terminar_periodo" class="dropdown-item" href="#">Finalizar Periodo de avaliação</a></li>
				<!-- <li>
					<hr class="dropdown-divider">
				</li>
				<li><a class="dropdown-item" href="#">Encerrar Projeto</a></li> -->
			</ul>
			`;
		const lista_lista = 
			document.getElementById('lista_lista');
		lista_lista.insertBefore(li, document.getElementById('li_perfil'));

		document.getElementById('inicializar_periodo')
			.addEventListener('click', inicializar_periodo);

		document.getElementById('terminar_periodo')
			.addEventListener('click', terminar_periodo);

		async function inicializar_periodo(e){
			e.preventDefault();
			const token = user_creds.token;
			const id_proj = projeto.id;
			const iniciado_b = true;
			const terminado_b = false;
			const opt ={
				method: 'PUT',
				body: JSON.stringify({id_proj, iniciado_b, terminado_b}),
				headers: {
					"Authorization": "Bearer "+token,
					"Content-Type": "application/json"
				}
			};
			await fetch(`${BASE_URL}/api/v1/periodo_avaliacao`, opt)
				.then(async data => {
					const data_json = await data.json();
					if(data_json.msg)
						alert(data_json.msg);
					else 
						alert('O período de início foi iniciado.');
				});
		}

		async function terminar_periodo(e){
			e.preventDefault();
			const token = user_creds.token;
			const id_proj = projeto.id;
			const iniciado_b = true;
			const terminado_b = true;
			const opt ={
				method: 'PUT',
				body: JSON.stringify({id_proj, iniciado_b, terminado_b}),
				headers: {
					"Authorization": "Bearer "+token,
					"Content-Type": "application/json"
				}
			};
			await fetch(`${BASE_URL}/api/v1/periodo_avaliacao`, opt)
				.then(async data => {
					const data_json = await data.json();
					if(data_json.msg)
						alert(data_json.msg);
					else
						alert('O período de avaliação foi terminado');
				});
		}
	}
}

get_grupos();
render_conditionals();
