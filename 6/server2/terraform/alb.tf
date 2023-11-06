resource "aws_lb_target_group" "ec2-target-group" {
  name     = "${var.name}-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.main.id
  target_type = "instance"

  health_check {
    path                = "/health"
    port                = 80
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 10
    interval            = 60
    matcher             = "200"
    protocol = "HTTP"
  }
}

resource "aws_lb_listener_rule" "rule" {
  listener_arn = data.aws_lb_listener.listener.arn
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ec2-target-group.arn
  }

  condition {
    host_header {
      values = ["bcit-backend.miniaturepug.info"]
    }
  }

  condition {
    path_pattern {
      values = ["/comp/4537/labs/6/api/v1/*"]
    }
  }
}

resource "aws_lb_target_group_attachment" "test" {
  target_group_arn = aws_lb_target_group.ec2-target-group.arn
  target_id        = aws_instance.ec2.id
  port             = 80
}
