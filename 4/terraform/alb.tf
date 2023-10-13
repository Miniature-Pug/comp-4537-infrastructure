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

resource "aws_lb_listener" "ec2-alb-https-listener" {
  load_balancer_arn = data.aws_lb.ec2.arn
  port              = "443"
  protocol          = "HTTPS"
  depends_on        = [aws_lb_target_group.ec2-target-group]
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-0-2021-06"
  certificate_arn   = data.aws_acm_certificate.amazon_issued.arn

  default_action {
    type             = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      status_code  = "200"
      message_body = "OK"
    }
  }
}

resource "aws_lb_listener_rule" "rule" {
  listener_arn = aws_lb_listener.ec2-alb-https-listener.arn
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
      values = ["/COMP4537/labs/4/api/definitions*"]
    }
  }
}

resource "aws_lb_target_group_attachment" "test" {
  target_group_arn = aws_lb_target_group.ec2-target-group.arn
  target_id        = aws_instance.ec2.id
  port             = 80
}
