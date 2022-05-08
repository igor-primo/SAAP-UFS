const disciplina = JSON.parse(sessionStorage.getItem('disc'));
const user_creds = JSON.parse(sessionStorage.getItem('user_creds'));
console.log(disciplina);

let projetos = [];

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
		`http://127.0.0.1:5000/api/v1/projeto/${id_disc}/disciplina`,
		opt
	).then(async data => {
		projetos = await data.json();
		console.log(projetos);
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
	
}

get_projetos();
//get_alunos();
//get_professores();
//get_integrantes();
