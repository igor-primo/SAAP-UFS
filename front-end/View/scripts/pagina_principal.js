import BASE_URL from './url.js';
const user_creds = JSON.parse(sessionStorage.getItem('user_creds'));
let disciplinas = [];

async function get_disciplinas(){

	const token = user_creds.token;
	console.log(user_creds);
	const bearer = "Bearer " + token;
	const opt = {
		headers: {
			"Authorization": bearer
		}
	};
	await fetch(
		`${BASE_URL}/api/v1/disciplina`,
		opt
	).then(async data => {
		disciplinas = await data.json();
		console.log(disciplinas);
		for(let i=0;i<disciplinas.length;i++){
			const disc = document.createElement('div');
			disc.setAttribute('id', disciplinas[i].id);
			disc.setAttribute('class', 'card text-center');
			disc.setAttribute('style', 'width: 15em;');
			disc.innerHTML = `
                <div class="nav-item dropend text-end" style="font-weight: bold;">
                    <a class="nav-link dropdown active text-dark" href="#" id="navbarDropdown" role="button"
                        data-bs-toggle="dropdown" aria-expanded="false">. . . 
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" href="#">Editar Disciplina</a></li>
                        <li><a class="dropdown-item" href="#">Apagar Disciplina</a></li>
                    </ul>
                </div>
                <a href=""><img src="/front-end/Image/ufs_colorido_horizontal_positiva-830x370.png"
                        class="card-img-top imagemDisciplina" alt="Logo Ufs"></a>
                <div class="card-body ">
                    <a style="text-decoration: none; color: black;" href="">
                        <h5 class="card-title">${disciplinas[i].nome_disc}</h5></a>
                    <p class="card-text">Professor(a): ${disciplinas[i].username}</p>
                    <!-- <p class="card-text">Horário:</p> -->
                    <a name="entrar_button" href="Disciplina.html" class="btn btn-primary">Entrar</a>
                </div>
				`;
			document.getElementById('Disciplinas').appendChild(disc);

		}

		const entrar_button = document.getElementsByName('entrar_button');
		for(let i=0;i<entrar_button.length;i++)
			entrar_button[i].addEventListener('click', entrar_disciplina);

		function entrar_disciplina(e){
			//e.preventDefault();
			console.log(e.srcElement)
			const disc = e.srcElement.parentNode.parentNode;
			console.log(disc.id);
			const disc_id = disc.id;
			for(let i=0;i<disciplinas.length;i++)
				if(disc_id == disciplinas[i].id)
					sessionStorage.setItem('disc', JSON.stringify(disciplinas[i]));
			//window.location = '/front-end/View/Disciplina.html';
		}

	});

}

function render_conditionals(){
	if(!user_creds.is_aluno){
		const cd = 
			document.createElement('a');
		cd.setAttribute('class', 'nav-link active')
		cd.setAttribute('href', 'CadastroDisciplina.html')
		cd.innerHTML = 'Cadastrar Disciplina';
		const li =
			document.createElement('li');
		li.setAttribute('class', 'nav_item');
		li.appendChild(cd);
		document.getElementById('lista_opcoes')
			.insertBefore(
				li,
				document.getElementById('id_perfil')
			);
	}
}

get_disciplinas();
render_conditionals();
