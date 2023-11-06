data "aws_iam_policy_document" "ec2" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com",
                    "ec2.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "ec2" {
  name               = var.name
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.ec2.json
  inline_policy {
    name = "rds_db_connect"

    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Action   = ["rds-db:*"]
          Effect   = "Allow"
          Resource = "arn:aws:rds:us-east-1:598490276344*"
        },
      ]
    })
  }
}

resource "aws_iam_instance_profile" "ec2" {
  name  = var.name
  role  = aws_iam_role.ec2.name
}

resource "aws_iam_role_policy_attachment" "ssm-policy" {
role       = aws_iam_role.ec2.name
policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "ecr-policy" {
role       = aws_iam_role.ec2.name
policy_arn = "arn:aws:iam::aws:policy/EC2InstanceProfileForImageBuilderECRContainerBuilds"
}

resource "aws_iam_role_policy_attachment" "rds-policy" {
role       = aws_iam_role.ec2.name
policy_arn = "arn:aws:iam::aws:policy/AmazonRDSFullAccess"
}