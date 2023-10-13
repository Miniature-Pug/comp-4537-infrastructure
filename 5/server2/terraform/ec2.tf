resource "aws_key_pair" "ssh_key" {
  key_name   = var.name
  public_key = file("./.ssh/id_ed25519.pub")
}

data "template_file" "startup" {
 template = file("user_data.sh")
}

resource "aws_instance" "ec2" {
  ami                         = "ami-067d1e60475437da2"
  iam_instance_profile        = aws_iam_instance_profile.ec2.name
  security_groups             = [aws_security_group.ec2.id]
  associate_public_ip_address = false
  instance_type               = "t2.micro"
  subnet_id                   = data.aws_subnet.private-1a.id
  key_name                    = aws_key_pair.ssh_key.key_name
  root_block_device {
    volume_size = 8
    volume_type = "gp2"
  }
  tags = {
    Name = var.name
  }
  user_data = data.template_file.startup.rendered
}