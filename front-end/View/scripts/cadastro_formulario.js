const user_creds = JSON.parse(sessionStorage.getItem('user_creds'));
const proj = JSON.parse(sessionStorage.getItem('proj'));
const form = document.forms['formularioTopico'];
form.addEventListener('submit', handle_submit);

async function handle_submit(e) {
	e.preventDefault();
	let array_to_send = [];
	const topicos = document.getElementsByTagName("div");
	for (let i = 0; i < topicos.length; i++)
		if (topicos[i].id === 'topico') {
			const topic_name = topicos[i].children[0].children[1].value;
			//console.log(topic_name);
			array_to_send.push(topic_name);
			const criterios = topicos[i].children;
			let array_criterios = [];
			for (let j = 0; j < criterios.length; j++)
				if (criterios[j].id === 'criterio') {
					console.log(criterios[j].children[1].value);
					const criterio = criterios[j].children[1].value;
					array_criterios.push(criterio);
				}
			array_to_send.push(array_criterios);
		}
	console.log(array_to_send);
	const token = user_creds.token;
	const id_proj = proj.id;
	const data_comeco = new Date();
	const data_fim = new Date();
	const secoes = array_to_send;
	const opt = {
		method: 'POST',
		body: JSON.stringify({
			id_proj,
			data_comeco,
			data_fim,
			secoes
		}),
		headers: {
			"Authorization": "Bearer "+token,
			"Content-Type": "application/json"
		}
	};
	await fetch(
		`http://127.0.0.1:5000/api/v1/formulario/${id_proj}/projeto`,
		opt
	).then(async data => {
		const data_json = await data.json();
		if(data_json.msg)
			alert(data_json.msg);
		else
			alert('Formulário criado com sucesso.');
	});
}

function adicionarTopico() {
	const tag = document.getElementById('formularioAvaliacaoProjeto');
	console.log(tag);
	let html =
		`<div id="topico"> 
		<div class="nomeTopico"> 
			<label for="Nome do tópico">
				Nome do tópico:
			</label> 
			<input type="text" name="nomeTopico" class="nomeTopico"/> 
			<button type="button" onclick="removerTopico(this)">
				Remover tópico
			</button> 
		</div> 
		<div id="criterio">  
			<label for="nomeCriterio">
				Nome do criterio:
			</label>
			<input type="text" name="nomeCriterio" id="nomeCriterio"/> 
			<button type="button" onclick="adicionarCriterio(this)"> 
				+ 
			</button>  
		</div> 
	</div>`;
	const new_topic = document.createElement("topico");
	new_topic.innerHTML = html;
	tag.appendChild(new_topic);
}

function removerTopico(elem) {
	console.log(elem);
	console.log(elem.parentNode.parentNode);
	const to_delete = elem.parentNode.parentNode;
	to_delete.parentNode.removeChild(to_delete);
}

function adicionarCriterio(elem) {
	console.log(elem);
	console.log(elem.parentNode.parentNode);
	const add_to = elem.parentNode.parentNode;
	let html =
		`<label for="nomeCriterio">
				Nome do criterio:
			</label> 
			<input type="text" name="nomeCriterio" id="nomeCriterio"/> 
			<button type="button" onclick="removerCriterio(this)">
				- 
			</button>`;
	const new_el = document.createElement("div");
	new_el.setAttribute('id', 'criterio');
	new_el.innerHTML = html;
	add_to.appendChild(new_el);
}

function removerCriterio(elem) {
	console.log(elem);
	console.log(elem.parentNode);
	const to_delete = elem.parentNode;
	to_delete.parentNode.removeChild(to_delete);
}
