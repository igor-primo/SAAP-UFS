#!/bin/bash

BASE_URL="$1/api/v1"

echo 'SAAP - Test Suite'

while true
do
	echo '1 - Signup'
	read opt
	case $opt in
		'1')
			echo 'Username?'
			read username
			echo 'Password?'
			read password
			echo 'email'
			read email

			curl -v -POST "$BASE_URL/auth/signup" \
				-d 'username='"$username"'' \
				-d 'password='"$password"'' \
				-d 'email='"$email"'' | jq '.'
			;;
		*)
			;;
	esac
done
