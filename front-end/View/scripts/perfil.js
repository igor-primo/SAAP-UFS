window.addEventListener('load', handle_load);

async function handle_load(e){
	const user_creds = JSON.parse(sessionStorage.getItem('user_creds'));
	console.log(user_creds);
	document.getElementById('username').placeholder = user_creds.username;
	document.getElementById('username2').placeholder = user_creds.username;
	document.getElementById('email').placeholder = user_creds.email;
	document.getElementById('matricula').placeholder = user_creds.matricula;
}
