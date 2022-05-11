const grupo = JSON.parse(sessionStorage.getItem('grupo'));
const proj = JSON.parse(sessionStorage.getItem('proj'));
const user_creds = JSON.parse(sessionStorage.getItem('user_creds'));

async function get_formulario(){
	const token = user_creds.token;
	const id_proj = proj.id;
	const opt = {
		method: 'GET',
		headers: {
			"Authorization": "Bearer "+token,
		}
	};
	await fetch(
		`http://127.0.0.1:5000/api/v1/formulario/${id_proj}/projeto`,
		opt
	).then(async data => {
		const formulario = await data.json();
		console.log(formulario);
		const corpo = document.getElementById('corpo');
		for(let i=0;i<formulario.length;i+=2){
			const topico = document.createElement('div');
			topico.setAttribute('name', 'topico');
			topico.setAttribute('class', 'topico text-center');
			const h3 = document.createElement('h3');
			h3.innerHTML = `${formulario[i]}`;
			for(let j=0;j<formulario[i+1].length;j++){
				console.log(formulario[i]);
				console.log(formulario[i+1][j]);
				const criterio = document.createElement('div');
				criterio.innerHTML = `
                <h4 class="text-start ms-3 me-3">Criterio: ${formulario[i+1][j].pergunta}</h4>
                    <div class="row g-3 align-items-center ms-3 me-3 mt-2">
                        <div class="col-auto">
                            <label for="nota" class="col-form-label">Nota:</label>
                        </div>
                        <div class="col-auto">
                            <input type="number" id="nota" class="form-control" max="10" min="0">
                        </div>
                        <div class="col-auto">
                            <span id="valueHelpInline" class="form-text">
                                Valores de 0 - 10.
                            </span>
                        </div>
                    </div>

				`;
				h3.appendChild(criterio);
			}
			topico.appendChild(h3);
			const enviar_div_button = 
				document.getElementById('enviar_div_button');
			corpo.insertBefore(topico, enviar_div_button);
			//corpo.appendChild(topico);
		}
	});
}

get_formulario();
