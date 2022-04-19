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

			curl -v -X POST "$BASE_URL/auth/signup" \
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

			curl -v "$BASE_URL/auth/token" \
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
		*)
			;;
	esac
done
