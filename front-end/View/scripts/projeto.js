const projeto = JSON.parse(sessionStorage.getItem('proj'));
const user_creds = JSON.parse(sessionStorage.getItem('user_creds'));
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
		`http://127.0.0.1:5000/api/v1/grupo/${id_proj}/projeto`,
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
                <div class="card-body">
                  <h5 class="card-title">Grupo ${grupos[i].nome}</h5>
                  <p class="card-text">Tema: ${grupos[i].nome}</p>
                  <a href="Avaliacao.html" class="btn btn-primary">Avaliar</a>
                  <a href="Grupo.html" class="btn btn-primary m-1">Vizualizar</a>
                </div>
			`;
			grupos_sec.appendChild(grupo);
		}
	});
}

get_grupos();
