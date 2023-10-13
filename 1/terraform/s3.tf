data "aws_s3_bucket" "cloudfront" {
  bucket = "bcit-cloudfront"
}

resource "aws_s3_object" "static_files" {
  for_each = { for item in var.static_files : item.key => {
    source       = item.source
    content_type = item.content_type
    }
  }
  bucket       = data.aws_s3_bucket.cloudfront.id
  key          = "${var.s3_bucket_prefix}${each.key}"
  content_type = each.value.content_type
  source       = each.value.source
  etag         = filemd5("${each.value.source}")
}

resource "null_resource" "cache-invaldiation" {

  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${data.aws_cloudfront_distribution.static.id} --paths '/*'"
  }

  depends_on = [ aws_s3_object.static_files ]
}
