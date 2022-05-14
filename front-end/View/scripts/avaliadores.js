import BASE_URL from './url.js';
const proj = JSON.parse(sessionStorage.getItem('proj'));
const user_creds = JSON.parse(sessionStorage.getItem('user_creds'));
const list_integrantes = JSON.parse(sessionStorage.getItem('list_integrantes'));
console.log(list_integrantes);
//const user_creds = JSON.parse(sessionStorage.getItem('user_creds'));

let avaliadores = [];

async function get_avaliadores(){
	const token = user_creds.token;
	const id_proj = proj.id;
	const opt = {
		method: 'GET',
		headers: {
			"Authorization": "Bearer "+token,
		}
	};
	console.log(opt);
	await fetch(
		`${BASE_URL}/api/v1/avaliador/${id_proj}/avaliadores`,
		opt
	).then(async data => {
		avaliadores = await data.json();
		if(avaliadores.msg)
			alert(avaliadores.msg);
		else{
			console.log(avaliadores);
			const tabela_avaliadores =
				document.getElementById('tabela_avaliadores');
			for(let i=0;i<avaliadores.length;i++){
				const tr = document.createElement('tr');
				tr.innerHTML = 
					`
					<th scope="row">1</th>
					<td>${avaliadores[i].username}</td>
					<td>${avaliadores[i].username}</td>
					<td style="cursor: pointer;"><span class="material-icons-outlined btnRemover"
							onclick="apagarAluno(this.parentNode.parentNode.rowIndex)">close</span></td>
					`;
				tabela_avaliadores.appendChild(tr);
			}
		}
	});
}

function mount_tabela_integrantes(){
	const tabela_integrantes_avaliadores =
		document.getElementById('tabela_integrantes_avaliadores');
	for(let i=0;i<list_integrantes.length;i++){
		if(list_integrantes[i].id == user_creds.id) continue;
		const checkbox = document.createElement('input');
		checkbox.setAttribute('type', 'checkbox');
		checkbox.setAttribute('class', 'custom-control-input');
		checkbox.setAttribute('id', list_integrantes[i].id);
		checkbox.setAttribute('name', 'post_avaliadores_checkbox');
		const th = document.createElement('th');
		th.setAttribute('scope', 'row');
		th.appendChild(checkbox);
		const td1 = document.createElement('td');
		td1.innerHTML = `${list_integrantes[i].username}`;
		const td2 = document.createElement('td');
		td2.innerHTML = `${list_integrantes[i].username}`;
		const tr = document.createElement('tr');
		tr.appendChild(th);
		tr.appendChild(td1);
		tr.appendChild(td2);
		/*
		const tr = document.createElement('tr');
		tr.innerHTML = 
			`
			<th scope="row">1</th>
			<td>${list_integrantes[i].username}</td>
			<td>${list_integrantes[i].username}</td>
			<td style="cursor: pointer;"><span class="material-icons-outlined btnRemover"
					onclick="apagarAluno(this.parentNode.parentNode.rowIndex)">close</span></td>
			`;
			*/
		tabela_integrantes_avaliadores.appendChild(tr);
	}
	document.getElementById('enviar_integrantes_button')
		.addEventListener('click', post_avaliadores);

	async function post_avaliadores(){
		const token = user_creds.token;
		const checkboxes = 
			document.getElementsByName('post_avaliadores_checkbox');
		let id_us_arr = [];
		for(let i=0;i<checkboxes.length;i++)
			if(checkboxes[i].checked)
				id_us_arr.push(checkboxes[i].id);
		const id_proj = proj.id;
		const opt = {
			method: 'POST',
			body: JSON.stringify({id_us_arr, id_proj}),
			headers: {
				"Authorization": "Bearer "+token,
				"Content-Type": "application/json"
			}
		};
		console.log(opt);
		await fetch(
			`${BASE_URL}/api/v1/avaliador/post_avaliadores`,
			opt
		).then(async data => {
			const data_json = data.json();
			if(data_json.msg)
				alert(data_json.msg);
			else
				alert('Avaliadores cadastrados com sucesso.');
		});
	}
}

get_avaliadores();
mount_tabela_integrantes();
