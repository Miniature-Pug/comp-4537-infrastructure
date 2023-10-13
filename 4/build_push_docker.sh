#! /usr/bin/sh

docker build -t comp4537-lab4-backend:latest -f ./terraform/Dockerfile .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 598490276344.dkr.ecr.us-east-1.amazonaws.com
docker tag comp4537-lab4-backend:latest 598490276344.dkr.ecr.us-east-1.amazonaws.com/bcit-local:comp4537-lab4-backend
docker push 598490276344.dkr.ecr.us-east-1.amazonaws.com/bcit-local:comp4537-lab4-backend