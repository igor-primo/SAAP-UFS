#!/bin/bash

BASE_URL="$1/api/v1"
TOKEN=''

echo 'SAAP - Test Suite'

while true
do
	echo '1 - Signup'
	echo '2 - Login'
	echo '3 - Test Token'
	echo '4 - Get Disciplinas'
	echo '5 - Post Disciplinas'
	echo '6 - Cadastrar Usuário em Disciplina'
	echo '7 - Get Projetos'
	echo '8 - Post Projeto'
	echo '9 - Get Grupos'
	echo '10 - Post Grupo'
	echo '11 - Get Formulario'
	echo '12 - Post Formulario'
	echo '13 - Get Users'
	read opt
	case $opt in
		'1')
			echo 'Username?'
			read username
			echo 'Password?'
			read password
			echo 'Email?'
			read email
			echo 'Matricula?'
			read matricula
			echo 'Aluno? (true/false)'
			read is_aluno

			curl -X POST "$BASE_URL/auth/signup" \
				-d 'username='"$username"'' \
				-d 'password='"$password"'' \
				-d 'email='"$email"'' \
				-d 'matricula='"$matricula"'' \
				-d 'is_aluno='"$is_aluno"'' | jq '.'
			;;
		'2')
			echo 'Email?'
			read email
			echo 'Password?'
			read password

			TOKEN=$(curl -v -X POST "$BASE_URL/auth/login" \
				-d 'email='"$email"'' \
				-d 'password='"$password"'' | jq '.token' | tr -d '"')

			echo "$TOKEN"
			;;
		'3')

			curl "$BASE_URL/auth/token" \
				-H 'Authorization: Bearer '$TOKEN''
			;;
		'4')
			curl "$BASE_URL/disciplina" \
				-H 'Authorization: Bearer '$TOKEN'' | jq '.'
			;;
		'5')
			echo 'Name of discipline?'
			read nome_disc

			curl -X POST "$BASE_URL/disciplina" \
				-H 'Authorization: Bearer '$TOKEN'' \
				-d 'nome_disc='"$nome_disc"'' | jq '.'

			;;
		'6')
			echo 'User id?'
			read id_us
			echo 'Discipline id?'
			read disc_id

			curl -X POST "$BASE_URL/disciplina/cadastrar_usuario" \
				-H 'Authorization: Bearer '$TOKEN'' \
				-d 'id_us='"$id_us"'' \
				-d 'disc_id='"$disc_id"'' | jq '.'
			;;
		'7')
			echo 'Disciplina id?'
			read id_disc

			curl "$BASE_URL/projeto/$id_disc/disciplina" \
				-H 'Authorization: Bearer '$TOKEN''
			;;
		'8')
			echo 'Disciplina id?'
			read id_disc
			echo 'nome?'
			read nome
			echo 'Individual?'
			read is_indiv
			echo 'Ponderada?'
			read is_pond
			echo 'Peso?'
			read peso
			echo 'Data apresentacao?'
			read data_apres

			curl -X POST "$BASE_URL/projeto/$id_disc/disciplina" \
				-H 'Authorization: Bearer '$TOKEN'' \
				-d 'nome='"$nome"'' \
				-d 'is_indiv='"$is_indiv"'' \
				-d 'is_pond='"$is_pond"'' \
				-d 'peso='"$peso"'' \
				-d 'data_apres='"$data_apres"''
			;;
		'9') 
			echo 'Projeto id?'
			read id_proj

			curl "$BASE_URL/grupo/$id_proj/projeto" \
				-H 'Authorization: Bearer '$TOKEN''
			;;
		'10') 
			echo 'Projeto id?'
			read id_proj
			echo 'Nome?'
			read nome

			curl "$BASE_URL/grupo/$id_proj/projeto" \
				-H 'Authorization: Bearer '$TOKEN'' \
				-d 'nome='"$nome"''
			;;
		'11')
			echo 'Projeto id?'
			read id_proj

			curl "$BASE_URL/formulario/$id_proj/projeto" \
				-H 'Authorization: Bearer '$TOKEN''
			;;
		'12')
			echo 'Projeto id?'
			read id_proj

			curl -X POST "$BASE_URL/formulario/$id_proj/projeto" \
				-H 'Authorization: Bearer '$TOKEN''
			;;
		'13')
			curl "$BASE_URL/avaliador/users" \
				-H 'Authorization: Bearer '$TOKEN''
			;;
		*)
			;;
	esac
done
