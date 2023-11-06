terraform {
  backend "s3" {
    bucket  = "bcit-local"
    key     = "comp/4537/labs/6/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}

# aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 598490276344.dkr.ecr.us-east-1.amazonaws.com