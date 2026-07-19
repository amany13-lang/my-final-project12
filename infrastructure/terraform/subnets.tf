resource "aws_subnet" "public1" {

  vpc_id = aws_vpc.main.id

  cidr_block = "10.0.1.0/24"

  availability_zone = "${var.aws_region}a"

  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-1"
  }

}
resource "aws_subnet" "public2" {

  vpc_id = aws_vpc.main.id

  cidr_block = "10.0.2.0/24"

  availability_zone = "${var.aws_region}b"

  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-2"
  }

}
resource "aws_subnet" "private1" {

  vpc_id = aws_vpc.main.id

  cidr_block = "10.0.3.0/24"

  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "private-subnet-1"
  }

}
resource "aws_subnet" "private2" {

  vpc_id = aws_vpc.main.id

  cidr_block = "10.0.4.0/24"

  availability_zone = "${var.aws_region}b"

  tags = {
    Name = "private-subnet-2"
  }

}