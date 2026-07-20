resource "aws_vpc" "main" {

  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}
resource "aws_subnet" "public1" {

  vpc_id                  = aws_vpc.main.id

  cidr_block              = "10.0.1.0/24"

  availability_zone       = "${var.aws_region}a"

  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public1"
  }
}
resource "aws_subnet" "public2" {

  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public2"
  }
}
resource "aws_subnet" "private1" {

  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "${var.project_name}-private1"
  }
}

resource "aws_subnet" "private2" {

  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = "${var.aws_region}b"

  tags = {
    Name = "${var.project_name}-private2"
  }
}
resource "aws_internet_gateway" "igw" {

  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}
resource "aws_eip" "nat" {

  domain = "vpc"

  tags = {
    Name = "${var.project_name}-nat-eip"
  }
}
resource "aws_nat_gateway" "nat" {

  allocation_id = aws_eip.nat.id

  subnet_id = aws_subnet.public1.id

  depends_on = [
    aws_internet_gateway.igw
  ]

  tags = {
    Name = "${var.project_name}-nat"
  }
}
resource "aws_route_table" "public" {

  vpc_id = aws_vpc.main.id

  route {

    cidr_block = "0.0.0.0/0"

    gateway_id = aws_internet_gateway.igw.id

  }

  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

resource "aws_route_table_association" "public1" {

  subnet_id = aws_subnet.public1.id

  route_table_id = aws_route_table.public.id

}

resource "aws_route_table_association" "public2" {

  subnet_id = aws_subnet.public2.id

  route_table_id = aws_route_table.public.id

}
resource "aws_route_table" "private" {

  vpc_id = aws_vpc.main.id

  route {

    cidr_block = "0.0.0.0/0"

    nat_gateway_id = aws_nat_gateway.nat.id

  }

  tags = {
    Name = "${var.project_name}-private-rt"
  }
}

resource "aws_route_table_association" "private1" {

  subnet_id = aws_subnet.private1.id

  route_table_id = aws_route_table.private.id

}

resource "aws_route_table_association" "private2" {

  subnet_id = aws_subnet.private2.id

  route_table_id = aws_route_table.private.id

}
resource "aws_security_group" "eks" {

  name = "${var.project_name}-eks-sg"

  description = "EKS Security Group"

  vpc_id = aws_vpc.main.id

  ingress {

    from_port = 80

    to_port = 80

    protocol = "tcp"

    cidr_blocks = ["0.0.0.0/0"]

  }

  ingress {

    from_port = 443

    to_port = 443

    protocol = "tcp"

    cidr_blocks = ["0.0.0.0/0"]

  }

  egress {

    from_port = 0

    to_port = 0

    protocol = "-1"

    cidr_blocks = ["0.0.0.0/0"]

  }

  tags = {
    Name = "${var.project_name}-eks-sg"
  }
}
resource "aws_security_group" "rds" {

  name   = "${var.project_name}-rds-sg"

  vpc_id = aws_vpc.main.id

  ingress {

    from_port = 5432

    to_port = 5432

    protocol = "tcp"

    security_groups = [
      aws_security_group.eks.id
    ]
  }

  egress {

    from_port = 0

    to_port = 0

    protocol = "-1"

    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-rds-sg"
  }
}
resource "aws_iam_role" "eks_cluster_role" {

  name = "${var.project_name}-eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-eks-cluster-role"
  }
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {

  role = aws_iam_role.eks_cluster_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"

}
resource "aws_iam_role" "eks_node_role" {

  name = "${var.project_name}-eks-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-eks-node-role"
  }
}

resource "aws_iam_role_policy_attachment" "worker_node_policy" {

  role = aws_iam_role.eks_node_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"

}

resource "aws_iam_role_policy_attachment" "cni_policy" {

  role = aws_iam_role.eks_node_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"

}

resource "aws_iam_role_policy_attachment" "ecr_policy" {

  role = aws_iam_role.eks_node_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"

}
resource "aws_ecr_repository" "backend" {

  name = "${var.project_name}-backend"

  image_scanning_configuration {

    scan_on_push = true

  }

  image_tag_mutability = "MUTABLE"

}
resource "aws_ecr_repository" "frontend" {

  name = "${var.project_name}-frontend"

  image_scanning_configuration {

    scan_on_push = true

  }

  image_tag_mutability = "MUTABLE"

}
resource "aws_eks_cluster" "main" {

  name = "${var.project_name}-cluster"

  role_arn = aws_iam_role.eks_cluster_role.arn

  version = "1.31"

  vpc_config {

    subnet_ids = [

      aws_subnet.public1.id,

      aws_subnet.public2.id,

      aws_subnet.private1.id,

      aws_subnet.private2.id

    ]

    security_group_ids = [

      aws_security_group.eks.id

    ]

  }

  depends_on = [

    aws_iam_role_policy_attachment.eks_cluster_policy

  ]
}
resource "aws_eks_node_group" "main" {

  cluster_name = aws_eks_cluster.main.name

  node_group_name = "${var.project_name}-nodes"

  node_role_arn = aws_iam_role.eks_node_role.arn

  subnet_ids = [

    aws_subnet.private1.id,

    aws_subnet.private2.id

  ]

  scaling_config {

    desired_size = 2

    max_size = 3

    min_size = 1

  }

  instance_types = [

    "t3.medium"

  ]

  capacity_type = "ON_DEMAND"

  depends_on = [

    aws_iam_role_policy_attachment.worker_node_policy,

    aws_iam_role_policy_attachment.cni_policy,

    aws_iam_role_policy_attachment.ecr_policy

  ]
}
resource "aws_db_subnet_group" "main" {

  name = "${var.project_name}-db-subnet-group"

  subnet_ids = [
    aws_subnet.private1.id,
    aws_subnet.private2.id
  ]

  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}
resource "aws_db_instance" "postgres" {

  identifier = "${var.project_name}-db"

  engine         = "postgres"
  engine_version = "16"

  instance_class    = "db.t3.micro"
  allocated_storage = 20

  db_name  = "leave_db"
  username = "postgres"
  password = "Password123!"

  db_subnet_group_name = aws_db_subnet_group.main.name

  vpc_security_group_ids = [
    aws_security_group.rds.id
  ]

  publicly_accessible = false

  skip_final_snapshot = true
}
resource "aws_secretsmanager_secret" "db_secret" {

  name = "${var.project_name}-db-secret"
}

resource "aws_secretsmanager_secret_version" "db_secret_version" {

  secret_id = aws_secretsmanager_secret.db_secret.id

  secret_string = jsonencode({
    username = "postgres"
    password = "Password123!"
  })
}