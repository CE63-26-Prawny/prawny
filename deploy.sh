#!/bin/sh
echo "$(tput setab 3)-------Build image-------------------------$(tput sgr0)"
docker-compose build
echo "$(tput setab 1)-------Down container----------------------$(tput sgr0)"
docker-compose down 
echo "$(tput setab 2)-------Docker-compose up-------------------$(tput sgr0)"
docker-compose up -d
if [ $? -eq 0 ] 
then
    echo "$(tput setab 2)-------DEPLOY COMPLETE---------------------$(tput sgr0)"
    exit 0
else
    echo "$(tput setab 1)-------DEPLOY FAIL-------------------------$(tput sgr0)"
    exit 1
fi
