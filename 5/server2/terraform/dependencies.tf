data "aws_subnet" "public-1a" {
  filter {
    name   = "tag:Name"
    values = ["bcit-public-1a"]
  }
}

data "aws_subnet" "private-1a" {
  filter {
    name   = "tag:Name"
    values = ["bcit-private-1a"]
  }
}

data "aws_security_group" "alb" {
  name = "alb"
}

data "aws_vpc" "main" {
  filter {
    name   = "tag:Name"
    values = ["bcit"]
  }
}

data "aws_lb" "ec2" {
  name  = "bcit"
}

data "aws_acm_certificate" "amazon_issued" {
  domain      = "bcit-backend.miniaturepug.info"
  types       = ["AMAZON_ISSUED"]
  most_recent = true
}
