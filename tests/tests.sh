#!/bin/bash

B="http://127.0.0.1:5000/api/v1"

# tests signup route

curl "${B}/auth/signup" -s

curl "${B}/auth/signup" \
	-s \
	-d 'username=a' \
	-d 'password=a' \
	-d 'email=a' \
	-d 'matricula=jjjjjjjjj' \
	-d 'is_aluno=true'
