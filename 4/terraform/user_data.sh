#!/bin/bash
sudo mkdir /tmp/ssm
cd /tmp/ssm
wget https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/debian_amd64/amazon-ssm-agent.debsudo dpkg -i amazon-ssm-agent.deb
sudo systemctl enable amazon-ssm-agent
rm amazon-ssm-agent.deb
sudo dnf install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo aws ecr get-login-password --region us-east-1 | sudo docker login --username AWS --password-stdin 598490276344.dkr.ecr.us-east-1.amazonaws.com
sudo docker pull 598490276344.dkr.ecr.us-east-1.amazonaws.com/bcit-local:comp4537-lab4-backend
sudo docker run -p 80:8081 -d 598490276344.dkr.ecr.us-east-1.amazonaws.com/bcit-local:comp4537-lab4-backend