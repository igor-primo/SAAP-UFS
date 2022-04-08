#!/bin/bash

BASE_URL="$1/api/v1"
TOKEN=''

echo 'SAAP - Test Suite'

while true
do
	echo '1 - Signup'
	echo '2 - Login'
	echo '3 - Test Token'
	read opt
	case $opt in
		'1')
			echo 'Username?'
			read username
			echo 'Password?'
			read password
			echo 'Email?'
			read email

			curl -v -X POST "$BASE_URL/auth/signup" \
				-d 'username='"$username"'' \
				-d 'password='"$password"'' \
				-d 'email='"$email"'' | jq '.'
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
		*)
			;;
	esac
done
