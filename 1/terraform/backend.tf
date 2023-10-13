terraform {
  backend "s3" {
    bucket  = "bcit-local"
    key     = "comp/4537/labs/1/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}
