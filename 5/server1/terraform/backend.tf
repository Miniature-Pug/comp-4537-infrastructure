terraform {
  backend "s3" {
    bucket         = "bcit-local"
    key            = "comp/4537/labs/5/fe/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock-dynamo"
  }
}
