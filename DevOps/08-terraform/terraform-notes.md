# Terraform — DevOps Interview Preparation Notes

---

## 1. Introduction

### What is Terraform?

Terraform is an open-source **Infrastructure as Code (IaC)** tool created by HashiCorp. It allows you to define, provision, and manage infrastructure across multiple cloud providers (AWS, Azure, GCP, etc.) using a declarative configuration language called **HCL (HashiCorp Configuration Language)**.

### Why Terraform Matters for DevOps

- **Consistency**: Infrastructure is defined as code, eliminating manual configuration drift.
- **Version Control**: Infrastructure definitions live in Git, enabling collaboration, code reviews, and audit trails.
- **Multi-Cloud**: A single tool to manage resources across AWS, Azure, GCP, and on-prem.
- **Automation**: Integrates seamlessly into CI/CD pipelines for automated provisioning.
- **Reusability**: Modules enable DRY (Don't Repeat Yourself) infrastructure patterns.
- **State Management**: Tracks the real-world state of infrastructure for accurate planning and updates.

### Infrastructure as Code (IaC) Concepts

| Concept | Description |
|---|---|
| **Declarative** | You describe the *desired state*; the tool figures out how to achieve it. |
| **Imperative** | You describe the *steps* to reach the desired state (e.g., scripts). |
| **Idempotency** | Applying the same configuration multiple times produces the same result. |
| **Drift Detection** | Detecting when real infrastructure diverges from the defined state. |
| **Immutable Infrastructure** | Replace resources instead of modifying them in place. |

Terraform follows the **declarative** approach — you define *what* you want, and Terraform determines *how* to create it.

---

## 2. Core Concepts

### HCL Syntax

HCL is Terraform's domain-specific language. Key constructs:

```hcl
# Block syntax
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "WebServer"
  }
}

# Expressions
locals {
  env_prefix = "${var.environment}-${var.project}"
}

# Conditional expression
resource "aws_instance" "example" {
  instance_type = var.environment == "prod" ? "t3.large" : "t3.micro"
}

# For expressions
output "instance_ips" {
  value = [for instance in aws_instance.web : instance.public_ip]
}

# Dynamic blocks
resource "aws_security_group" "example" {
  dynamic "ingress" {
    for_each = var.ingress_rules
    content {
      from_port   = ingress.value.from_port
      to_port     = ingress.value.to_port
      protocol    = ingress.value.protocol
      cidr_blocks = ingress.value.cidr_blocks
    }
  }
}
```

### Providers

Providers are plugins that interact with APIs of cloud platforms and services.

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Multiple provider configurations (aliases)
provider "aws" {
  alias  = "west"
  region = "us-west-2"
}

resource "aws_instance" "west_server" {
  provider      = aws.west
  ami           = "ami-0abcdef1234567890"
  instance_type = "t2.micro"
}
```

### Resources

Resources are the most important element — they describe infrastructure objects.

```hcl
resource "<PROVIDER>_<TYPE>" "<NAME>" {
  # Configuration arguments
}
```

Each resource has:
- **Arguments** (inputs): values you configure
- **Attributes** (outputs): values computed after creation (e.g., `id`, `arn`)
- **Meta-arguments**: `depends_on`, `count`, `for_each`, `provider`, `lifecycle`

### Variables

#### Input Variables

```hcl
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"

  validation {
    condition     = contains(["t2.micro", "t2.small", "t3.micro"], var.instance_type)
    error_message = "Instance type must be t2.micro, t2.small, or t3.micro."
  }
}
```

Variable types: `string`, `number`, `bool`, `list`, `map`, `set`, `object`, `tuple`

Ways to set variable values (in order of precedence, lowest to highest):
1. Default value in declaration
2. `terraform.tfvars` or `*.auto.tfvars`
3. `-var-file` flag
4. `-var` flag
5. `TF_VAR_<name>` environment variable

#### Output Variables

```hcl
output "instance_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_instance.web.public_ip
  sensitive   = false
}
```

#### Local Variables

```hcl
locals {
  common_tags = {
    Environment = var.environment
    Project     = var.project
    ManagedBy   = "terraform"
  }
}

resource "aws_instance" "web" {
  tags = local.common_tags
}
```

### Data Sources

Data sources let you fetch information from existing infrastructure or external sources.

```hcl
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_instance" "web" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t2.micro"
}
```

### State Management

Terraform state (`terraform.tfstate`) maps real-world resources to your configuration.

#### Local State (default)

```hcl
# State stored in ./terraform.tfstate (default, no config needed)
```

#### Remote State with S3 + DynamoDB

```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state-bucket"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}
```

DynamoDB provides **state locking** to prevent concurrent modifications.

| Aspect | Local State | Remote State (S3) |
|---|---|---|
| Storage | Local filesystem | S3 bucket |
| Locking | None | DynamoDB |
| Sharing | Not possible | Team-wide access |
| Encryption | No (by default) | SSE enabled |
| Versioning | Manual backups | S3 versioning |

### Modules

Modules are reusable, self-contained packages of Terraform configuration.

```hcl
# Module call
module "vpc" {
  source  = "./modules/vpc"
  # or from registry: "terraform-aws-modules/vpc/aws"

  vpc_cidr    = "10.0.0.0/16"
  environment = var.environment
}

# Accessing module outputs
resource "aws_instance" "web" {
  subnet_id = module.vpc.public_subnet_id
}
```

Module structure:
```
modules/vpc/
├── main.tf          # Resources
├── variables.tf     # Input variables
├── outputs.tf       # Output values
└── README.md        # Documentation
```

### Workspaces

Workspaces allow multiple state files for the same configuration (e.g., dev, staging, prod).

```bash
terraform workspace new dev
terraform workspace new staging
terraform workspace new prod
terraform workspace select dev
terraform workspace list
```

```hcl
# Use workspace name in configuration
resource "aws_instance" "web" {
  instance_type = terraform.workspace == "prod" ? "t3.large" : "t3.micro"

  tags = {
    Environment = terraform.workspace
  }
}
```

### Lifecycle Rules

```hcl
resource "aws_instance" "web" {
  # ...

  lifecycle {
    create_before_destroy = true   # Create replacement before destroying original
    prevent_destroy       = true   # Prevent accidental deletion
    ignore_changes        = [tags] # Ignore changes to specific attributes

    # Replace resource when any of these change
    replace_triggered_by = [
      aws_security_group.web.id
    ]
  }
}
```

| Rule | Purpose |
|---|---|
| `create_before_destroy` | Zero-downtime replacement; new resource created first |
| `prevent_destroy` | Terraform errors if a plan would destroy this resource |
| `ignore_changes` | External changes to listed attributes are ignored |
| `replace_triggered_by` | Force replacement when referenced resources change |

### Provisioners

Provisioners execute scripts on resources after creation. **Use as a last resort** — prefer native resource features.

```hcl
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  # Remote execution
  provisioner "remote-exec" {
    inline = [
      "sudo yum update -y",
      "sudo yum install -y httpd",
      "sudo systemctl start httpd"
    ]

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = file("~/.ssh/id_rsa")
      host        = self.public_ip
    }
  }

  # Local execution
  provisioner "local-exec" {
    command = "echo ${self.public_ip} >> inventory.txt"
  }

  # Destroy-time provisioner
  provisioner "local-exec" {
    when    = destroy
    command = "echo 'Instance destroyed' >> log.txt"
  }
}
```

### Terraform Import

Import existing infrastructure into Terraform management.

```bash
# CLI import (legacy)
terraform import aws_instance.web i-1234567890abcdef0

# Import block (Terraform 1.5+)
```

```hcl
import {
  to = aws_instance.web
  id = "i-1234567890abcdef0"
}
```

After import, you must write the matching configuration manually (or use `terraform plan -generate-config-out=generated.tf` in 1.5+).

### Terragrunt Overview

Terragrunt is a thin wrapper around Terraform that provides:
- **DRY backend configuration**: Define backend config once, inherit everywhere.
- **DRY provider configuration**: Share provider blocks across modules.
- **Dependency management**: Explicit dependency ordering between modules.
- **Inputs from other modules**: Pass outputs from one module as inputs to another.

```hcl
# terragrunt.hcl
terraform {
  source = "../modules/vpc"
}

inputs = {
  vpc_cidr    = "10.0.0.0/16"
  environment = "prod"
}

remote_state {
  backend = "s3"
  config = {
    bucket         = "my-terraform-state"
    key            = "${path_relative_to_include()}/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

### Backend Configuration

```hcl
# S3 Backend
terraform {
  backend "s3" {
    bucket         = "tf-state-bucket"
    key            = "project/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "tf-lock-table"
  }
}

# Azure Backend
terraform {
  backend "azurerm" {
    resource_group_name  = "tfstate-rg"
    storage_account_name = "tfstateaccount"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }
}

# Terraform Cloud / Enterprise
terraform {
  cloud {
    organization = "my-org"
    workspaces {
      name = "my-workspace"
    }
  }
}
```

---

## 3. Practical Examples

### Basic AWS Provider Setup

```hcl
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      ManagedBy   = "terraform"
      Environment = var.environment
    }
  }
}
```

### Creating an EC2 Instance

```hcl
resource "aws_instance" "web" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  key_name               = aws_key_pair.deployer.key_name

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
    encrypted   = true
  }

  tags = {
    Name = "${var.environment}-web-server"
  }
}

resource "aws_security_group" "web_sg" {
  name        = "${var.environment}-web-sg"
  description = "Security group for web server"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

### VPC with Subnets

```hcl
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = { Name = "${var.environment}-vpc" }
}

resource "aws_subnet" "public" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = { Name = "${var.environment}-public-${count.index + 1}" }
}

resource "aws_subnet" "private" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index + 10)
  availability_zone = var.availability_zones[count.index]

  tags = { Name = "${var.environment}-private-${count.index + 1}" }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.environment}-igw" }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = { Name = "${var.environment}-public-rt" }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}
```

### Using Modules

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.0"

  name = "${var.environment}-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = var.environment != "prod"

  tags = local.common_tags
}
```

### Remote State with S3

```hcl
# state-infra/main.tf — Create the backend resources first
resource "aws_s3_bucket" "terraform_state" {
  bucket = "my-company-terraform-state"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket                  = aws_s3_bucket.terraform_state.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-state-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
```

### Variable Definitions

```hcl
# variables.tf
variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "availability_zones" {
  description = "List of AZs"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "db_config" {
  description = "Database configuration"
  type = object({
    engine         = string
    instance_class = string
    allocated_storage = number
  })
  default = {
    engine            = "mysql"
    instance_class    = "db.t3.micro"
    allocated_storage = 20
  }
}
```

### Output Values

```hcl
# outputs.tf
output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "IDs of public subnets"
  value       = aws_subnet.public[*].id
}

output "web_server_ip" {
  description = "Public IP of the web server"
  value       = aws_instance.web.public_ip
}

output "db_endpoint" {
  description = "Database endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}
```

### Data Sources Example

```hcl
# Fetch latest Amazon Linux 2 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# Fetch current AWS account info
data "aws_caller_identity" "current" {}

# Fetch available AZs
data "aws_availability_zones" "available" {
  state = "available"
}

# Read remote state from another project
data "terraform_remote_state" "network" {
  backend = "s3"
  config = {
    bucket = "my-terraform-state"
    key    = "network/terraform.tfstate"
    region = "us-east-1"
  }
}

output "account_id" {
  value = data.aws_caller_identity.current.account_id
}
```

### Provisioners Example

```hcl
resource "aws_instance" "app" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"

  provisioner "file" {
    source      = "scripts/setup.sh"
    destination = "/tmp/setup.sh"

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = file("~/.ssh/id_rsa")
      host        = self.public_ip
    }
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/setup.sh",
      "/tmp/setup.sh"
    ]

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = file("~/.ssh/id_rsa")
      host        = self.public_ip
    }
  }

  provisioner "local-exec" {
    command = "ansible-playbook -i '${self.public_ip},' playbook.yml"
  }
}
```

---

## 4. Cheat Sheet

### Terraform CLI Commands

| Command | Description |
|---|---|
| `terraform init` | Initialize working directory, download providers and modules |
| `terraform plan` | Preview changes without applying them |
| `terraform apply` | Apply changes to reach the desired state |
| `terraform destroy` | Destroy all managed infrastructure |
| `terraform fmt` | Format configuration files to canonical style |
| `terraform validate` | Check configuration for syntax and internal consistency |
| `terraform state list` | List all resources in the state file |
| `terraform state show <resource>` | Show details of a resource in state |
| `terraform state mv` | Move a resource in state (rename/refactor) |
| `terraform state rm` | Remove a resource from state (without destroying it) |
| `terraform state pull` | Pull current remote state to stdout |
| `terraform state push` | Push a local state file to remote backend |
| `terraform import <addr> <id>` | Import existing infrastructure into state |
| `terraform workspace list` | List all workspaces |
| `terraform workspace new <name>` | Create a new workspace |
| `terraform workspace select <name>` | Switch to a workspace |
| `terraform workspace delete <name>` | Delete a workspace |
| `terraform output` | Show all output values |
| `terraform output <name>` | Show a specific output value |
| `terraform refresh` | Reconcile state with real infrastructure (deprecated in favor of `plan -refresh-only`) |
| `terraform taint <resource>` | Mark a resource for recreation on next apply (deprecated; use `-replace`) |
| `terraform untaint <resource>` | Remove taint from a resource |
| `terraform graph` | Generate a visual dependency graph (DOT format) |
| `terraform providers` | Show required providers for the configuration |
| `terraform plan -out=tfplan` | Save plan to a file for later apply |
| `terraform apply tfplan` | Apply a saved plan file |
| `terraform apply -target=<resource>` | Apply changes to a specific resource only |
| `terraform apply -replace=<resource>` | Force replacement of a specific resource |
| `terraform plan -refresh-only` | Detect drift without making changes |
| `terraform force-unlock <lock-id>` | Manually release a stuck state lock |
| `terraform console` | Interactive console for evaluating expressions |
| `terraform login` | Authenticate with Terraform Cloud |

### Common Flags

```bash
terraform plan -var="instance_type=t3.large"
terraform plan -var-file="prod.tfvars"
terraform apply -auto-approve
terraform destroy -auto-approve
terraform plan -out=tfplan
terraform apply -target=aws_instance.web
terraform apply -replace="aws_instance.web"
terraform state mv aws_instance.old aws_instance.new
terraform state rm aws_instance.decommissioned
terraform fmt -recursive
terraform validate -json
```

---

## 5. Hands-on Labs

### Lab 1: Provision an AWS VPC with Public/Private Subnets Using Modules

**Objective**: Create a production-ready VPC with modular code.

**Step 1**: Create the project structure.

```bash
mkdir -p terraform-vpc-lab/{modules/vpc,environments/dev}
cd terraform-vpc-lab
```

**Step 2**: Define the VPC module (`modules/vpc/main.tf`).

```hcl
variable "vpc_cidr" { type = string }
variable "environment" { type = string }
variable "public_subnet_cidrs" { type = list(string) }
variable "private_subnet_cidrs" { type = list(string) }
variable "availability_zones" { type = list(string) }

resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = { Name = "${var.environment}-vpc" }
}

resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.this.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true
  tags = { Name = "${var.environment}-public-${count.index + 1}" }
}

resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.this.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]
  tags = { Name = "${var.environment}-private-${count.index + 1}" }
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
  tags   = { Name = "${var.environment}-igw" }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }
  tags = { Name = "${var.environment}-public-rt" }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

output "vpc_id" { value = aws_vpc.this.id }
output "public_subnet_ids" { value = aws_subnet.public[*].id }
output "private_subnet_ids" { value = aws_subnet.private[*].id }
```

**Step 3**: Use the module from the environment (`environments/dev/main.tf`).

```hcl
module "vpc" {
  source               = "../../modules/vpc"
  vpc_cidr             = "10.0.0.0/16"
  environment          = "dev"
  public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnet_cidrs = ["10.0.10.0/24", "10.0.11.0/24"]
  availability_zones   = ["us-east-1a", "us-east-1b"]
}

output "vpc_id" { value = module.vpc.vpc_id }
```

**Step 4**: Initialize and apply.

```bash
cd environments/dev
terraform init
terraform plan
terraform apply
```

**Step 5**: Verify and clean up.

```bash
terraform output vpc_id
terraform destroy
```

---

### Lab 2: Manage Multi-Environment with Workspaces

**Objective**: Use workspaces to manage dev, staging, and prod environments from a single configuration.

**Step 1**: Create the configuration (`main.tf`).

```hcl
variable "instance_types" {
  default = {
    dev     = "t3.micro"
    staging = "t3.small"
    prod    = "t3.large"
  }
}

variable "instance_counts" {
  default = {
    dev     = 1
    staging = 2
    prod    = 3
  }
}

resource "aws_instance" "app" {
  count         = var.instance_counts[terraform.workspace]
  ami           = data.aws_ami.amazon_linux.id
  instance_type = var.instance_types[terraform.workspace]

  tags = {
    Name        = "${terraform.workspace}-app-${count.index + 1}"
    Environment = terraform.workspace
  }
}
```

**Step 2**: Create workspaces.

```bash
terraform init
terraform workspace new dev
terraform workspace new staging
terraform workspace new prod
```

**Step 3**: Deploy to each environment.

```bash
terraform workspace select dev
terraform apply

terraform workspace select staging
terraform apply

terraform workspace select prod
terraform apply
```

**Step 4**: Verify.

```bash
terraform workspace list
terraform workspace select dev
terraform state list
```

**Step 5**: Tear down.

```bash
for ws in prod staging dev; do
  terraform workspace select $ws
  terraform destroy -auto-approve
done
```

---

### Lab 3: Import Existing Infrastructure

**Objective**: Bring an existing AWS EC2 instance under Terraform management.

**Step 1**: Identify the existing resource.

```bash
aws ec2 describe-instances --instance-ids i-0abcdef1234567890
```

**Step 2**: Write a matching Terraform configuration (`main.tf`).

```hcl
resource "aws_instance" "imported" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  subnet_id     = "subnet-0abcdef1234567890"

  tags = {
    Name = "legacy-server"
  }
}
```

**Step 3**: Import the resource.

```bash
terraform init
terraform import aws_instance.imported i-0abcdef1234567890
```

**Step 4**: Compare and adjust.

```bash
terraform plan
# Fix any diffs in your configuration to match the imported state
```

**Step 5**: Validate management.

```bash
terraform plan   # Should show "No changes"
terraform apply  # Confirms Terraform now manages the resource
```

---

## 6. Real-world Scenarios

### Scenario 1: Managing Multi-Environment Infrastructure (Dev/Staging/Prod)

**Problem**: Your team needs isolated environments with different sizing but the same architecture.

**Approach A — Directory-based separation** (recommended for large differences):

```
infrastructure/
├── modules/
│   ├── networking/
│   ├── compute/
│   └── database/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   ├── staging/
│   │   ├── main.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   └── prod/
│       ├── main.tf
│       ├── terraform.tfvars
│       └── backend.tf
```

**Approach B — Workspace-based** (good for identical architecture, different sizing):

```hcl
# Single codebase with workspace-driven parameters
locals {
  env_config = {
    dev     = { instance_type = "t3.micro",  db_class = "db.t3.micro",  min_capacity = 1 }
    staging = { instance_type = "t3.small",  db_class = "db.t3.small",  min_capacity = 2 }
    prod    = { instance_type = "t3.large",  db_class = "db.r5.large",  min_capacity = 3 }
  }
  config = local.env_config[terraform.workspace]
}
```

**Approach C — Terragrunt** (DRY + directory separation):

```
live/
├── terragrunt.hcl          # Root config (backend, providers)
├── dev/
│   ├── vpc/terragrunt.hcl
│   ├── app/terragrunt.hcl
│   └── db/terragrunt.hcl
├── staging/
│   └── ...
└── prod/
    └── ...
```

---

### Scenario 2: State File Corruption Recovery

**Problem**: Your `terraform.tfstate` file is corrupted or accidentally deleted.

**Recovery Steps**:

1. **If using S3 backend with versioning** — restore a previous version:
   ```bash
   aws s3api list-object-versions --bucket my-tf-state --prefix prod/terraform.tfstate
   aws s3api get-object --bucket my-tf-state --key prod/terraform.tfstate \
     --version-id "version-id-here" terraform.tfstate.backup
   terraform state push terraform.tfstate.backup
   ```

2. **If state is lost completely** — reimport all resources:
   ```bash
   # List real resources
   aws ec2 describe-instances --filters "Name=tag:ManagedBy,Values=terraform"
   # Re-import each resource
   terraform import aws_instance.web i-0abcdef1234567890
   terraform import aws_vpc.main vpc-0abcdef1234567890
   # Repeat for all resources
   terraform plan  # Verify no changes
   ```

3. **If state is locked and the process crashed**:
   ```bash
   terraform force-unlock <LOCK_ID>
   ```

**Prevention best practices**:
- Always use **remote state** with **versioning** enabled.
- Enable **state locking** (DynamoDB for S3 backend).
- Use **S3 bucket versioning** for point-in-time recovery.
- Never manually edit the state file.

---

### Scenario 3: Migrating from Manual Infrastructure to Terraform

**Problem**: Your team has hundreds of manually created AWS resources. You need to bring them under Terraform management.

**Step-by-step strategy**:

1. **Inventory**: Document all existing resources.
   ```bash
   aws resourcegroupstaggingapi get-resources --output json > inventory.json
   ```

2. **Prioritize**: Start with foundational resources (VPC, subnets, security groups) before dependent ones (EC2, RDS).

3. **Write Configuration**: Create `.tf` files matching the current state.

4. **Import Resources**:
   ```bash
   terraform import aws_vpc.main vpc-12345
   terraform import aws_subnet.public subnet-12345
   terraform import aws_instance.web i-12345
   ```

5. **Iterate**: Run `terraform plan` after each import and fix configuration diffs until the plan shows no changes.

6. **Generate config** (Terraform 1.5+):
   ```bash
   # Add import blocks, then generate
   terraform plan -generate-config-out=generated_resources.tf
   ```

7. **Validate**: Ensure `terraform plan` shows "No changes" for all imported resources.

8. **Enforce**: Block manual changes via SCPs/IAM policies; all changes go through Terraform + CI/CD.

---

## 7. Interview Q&A

### Basic (Q1–Q15)

**Q1:** What is Terraform, and how does it differ from configuration management tools like Ansible?

> Terraform is an **Infrastructure as Code** tool for provisioning and managing cloud infrastructure. It is **declarative** and focuses on creating/managing infrastructure resources (VPCs, VMs, databases). Ansible is primarily a **configuration management** tool that configures software on existing servers. Terraform manages the *lifecycle* of infrastructure, while Ansible manages what runs *on* that infrastructure. They are complementary — Terraform provisions the server, Ansible configures it.

**Q2:** What is HashiCorp Configuration Language (HCL)?

> HCL is Terraform's domain-specific language for defining infrastructure. It is human-readable, supports variables, expressions, loops (`for_each`, `count`), conditionals, and functions. HCL files use the `.tf` extension. Terraform also supports JSON (`.tf.json`) as an alternative syntax.

**Q3:** What is a Terraform provider?

> A provider is a plugin that allows Terraform to interact with a specific API or service (e.g., AWS, Azure, GCP, Kubernetes). Providers are responsible for understanding API interactions, managing resources, and exposing data sources. They are downloaded during `terraform init`.

**Q4:** What is the Terraform state file, and why is it important?

> The state file (`terraform.tfstate`) is a JSON file that maps your configuration to real-world resources. It tracks resource IDs, attributes, and metadata. Without state, Terraform cannot determine what exists, what needs to change, or what to destroy. It is the **source of truth** for Terraform's understanding of your infrastructure.

**Q5:** What is the difference between `terraform plan` and `terraform apply`?

> `terraform plan` generates an **execution plan** showing what Terraform will do (create, modify, destroy) without actually making changes. `terraform apply` executes the plan and makes real changes to infrastructure. You can save a plan with `terraform plan -out=tfplan` and apply it with `terraform apply tfplan` to ensure the exact previewed changes are applied.

**Q6:** What are input variables in Terraform?

> Input variables are parameters that allow you to customize Terraform configurations without changing source code. They are defined with `variable` blocks and can have types, defaults, descriptions, and validation rules. Values are supplied via `.tfvars` files, CLI flags (`-var`), environment variables (`TF_VAR_*`), or interactively at runtime.

**Q7:** What are output values in Terraform?

> Output values expose information about your infrastructure after `terraform apply`. They are defined with `output` blocks and can be used to pass data between modules, display useful info to operators, or share state via `terraform_remote_state` data sources. Outputs can be marked `sensitive` to prevent display in CLI output.

**Q8:** What is `terraform init`, and when do you run it?

> `terraform init` initializes a working directory by downloading providers, modules, and configuring the backend. You run it when starting a new project, adding a new provider or module, or changing the backend configuration. It is safe to run multiple times (idempotent).

**Q9:** What is the purpose of `terraform.tfvars`?

> `terraform.tfvars` (and `*.auto.tfvars`) files provide values for declared input variables. They let you separate configuration from variable values, enabling different values per environment. Files named `terraform.tfvars` or `*.auto.tfvars` are loaded automatically; other filenames require the `-var-file` flag.

**Q10:** What is a Terraform resource?

> A resource is the most fundamental element in Terraform. Each resource block describes one or more infrastructure objects (e.g., an EC2 instance, an S3 bucket, a DNS record). Resources have a type, a local name, and configuration arguments. Terraform manages the full lifecycle — create, read, update, delete — for each resource.

**Q11:** How do you destroy infrastructure managed by Terraform?

> Use `terraform destroy` to remove all resources defined in the configuration. To destroy specific resources, use `terraform destroy -target=aws_instance.web`. Terraform generates a destroy plan and asks for confirmation before proceeding (unless `-auto-approve` is used).

**Q12:** What does `terraform fmt` do?

> `terraform fmt` rewrites Terraform configuration files to a canonical format and style. It ensures consistent formatting across team members. Use `terraform fmt -recursive` to format all files in subdirectories. Use `terraform fmt -check` in CI to verify formatting without modifying files.

**Q13:** What does `terraform validate` do?

> `terraform validate` checks the configuration for syntax errors and internal consistency (e.g., invalid references, type mismatches) without accessing any remote services or state. It runs after `terraform init` and is useful in CI pipelines for early error detection.

**Q14:** What are Terraform data sources?

> Data sources allow Terraform to read information from existing infrastructure or external systems without managing those resources. They are defined with `data` blocks. Common examples: fetching the latest AMI ID, reading a remote state file, or looking up an existing VPC by tag. Data sources are refreshed on every `plan`/`apply`.

**Q15:** What is the difference between `count` and `for_each`?

> Both create multiple resource instances. `count` uses an integer and references instances by index (`[0]`, `[1]`). `for_each` uses a map or set and references instances by key. `for_each` is preferred because removing an item from the middle doesn't shift all subsequent indices, preventing unnecessary recreation.

---

### Intermediate (Q16–Q35)

**Q16:** What is Terraform state locking, and why is it important?

> State locking prevents concurrent operations from corrupting the state file. When one user runs `terraform apply`, the state is locked so no other user can modify it simultaneously. With the S3 backend, DynamoDB provides locking. Without locking, two concurrent applies could result in a corrupted or inconsistent state.

**Q17:** How does remote state work with S3 and DynamoDB?

> S3 stores the state file with encryption and versioning. DynamoDB provides a locking mechanism using a `LockID` attribute. When Terraform starts an operation, it writes a lock entry to DynamoDB. Other Terraform processes check for the lock before proceeding. The lock is released after the operation completes.

**Q18:** What are Terraform modules, and why use them?

> Modules are reusable, encapsulated packages of Terraform configuration. They promote DRY principles, enforce standards, and simplify complex infrastructure. A module has its own variables (inputs), resources, and outputs. Modules can be sourced locally, from Git, from the Terraform Registry, or from S3.

**Q19:** What is the difference between a root module and a child module?

> The **root module** is the directory where you run `terraform apply` — it contains your top-level `.tf` files. **Child modules** are modules called by the root module (or other child modules) using `module` blocks. Every Terraform configuration has at least one root module.

**Q20:** How do Terraform workspaces work?

> Workspaces provide separate state files for the same configuration. The default workspace is named `default`. Each workspace has an independent state, so resources created in `dev` don't appear in `prod`. The current workspace name is available via `terraform.workspace`. Workspaces are best for small differences (sizing); for significantly different environments, use separate directories.

**Q21:** Explain the `lifecycle` meta-argument.

> The `lifecycle` block controls resource behavior: `create_before_destroy` creates a replacement before destroying the original (zero downtime); `prevent_destroy` blocks any plan that would destroy the resource; `ignore_changes` tells Terraform to ignore external changes to specified attributes; `replace_triggered_by` forces replacement when referenced resources change.

**Q22:** What is `terraform import`, and when would you use it?

> `terraform import` brings existing infrastructure under Terraform management by associating a real resource with a Terraform resource address in state. Use it when migrating from manually managed infrastructure to Terraform. After importing, you must write a matching configuration. Terraform 1.5+ supports `import` blocks for declarative imports.

**Q23:** What is drift detection in Terraform?

> Drift occurs when real infrastructure diverges from the Terraform state (e.g., someone manually changed a security group). Terraform detects drift during `plan`/`apply` by refreshing state from the provider. `terraform plan -refresh-only` explicitly detects drift without proposing configuration changes.

**Q24:** How do you manage secrets in Terraform?

> **Never** store secrets in plain text in `.tf` files or state. Best practices: use environment variables (`TF_VAR_*`), reference secrets from AWS Secrets Manager / HashiCorp Vault via data sources, use `sensitive = true` on variables and outputs, encrypt state at rest (S3 SSE), restrict state file access via IAM. Note: secrets in state are still stored in plain text within the state file — encrypting the backend is essential.

**Q25:** What are provisioners, and why should you avoid them?

> Provisioners (`remote-exec`, `local-exec`, `file`) run scripts on or against resources after creation. They should be avoided because they break Terraform's declarative model, create hidden dependencies, and are not re-run on subsequent applies. Prefer using cloud-init/user_data, Packer for AMIs, or configuration management tools instead.

**Q26:** Explain `depends_on` and implicit vs explicit dependencies.

> Terraform automatically determines dependencies by analyzing resource references (implicit). For example, if resource B references `resource_a.id`, Terraform knows to create A first. `depends_on` creates an **explicit** dependency when there is no direct reference but an ordering requirement exists (e.g., an IAM policy must exist before a resource that uses it indirectly).

**Q27:** What is a Terraform backend?

> A backend defines where Terraform stores state and how operations are executed. Local backend stores state on disk. Remote backends (S3, Azure Blob, GCS, Terraform Cloud) enable team collaboration, state locking, and encryption. Backend configuration is defined in the `terraform` block and initialized with `terraform init`.

**Q28:** How do you handle multiple AWS regions in Terraform?

> Use provider aliases. Define multiple `provider "aws"` blocks with different `alias` and `region` values. Reference the alias in resources using the `provider` meta-argument. This lets you create resources across regions within a single configuration.

**Q29:** What is `terraform taint` and its modern replacement?

> `terraform taint` marked a resource for destruction and recreation on the next apply. It was deprecated in Terraform 0.15.2. The modern replacement is `terraform apply -replace="aws_instance.web"`, which is more explicit, can be previewed with `plan`, and doesn't modify state before apply.

**Q30:** How do you structure a Terraform project for a large team?

> Recommended structure: separate **state per component** (networking, compute, database), use **modules** for reusable patterns, store state **remotely** with locking, use **CI/CD** for plan/apply, enforce **code review** for `.tf` changes, use `.tfvars` per environment, pin provider and module **versions**, and use **Terragrunt** or directory-based separation for multi-environment management.

**Q31:** What is the `terraform_remote_state` data source?

> It reads output values from another Terraform state file. This enables **cross-stack references** — for example, the compute stack can read VPC IDs from the networking stack's state. This decouples components while allowing data sharing.

**Q32:** How do you upgrade Terraform providers safely?

> Pin provider versions with `version = "~> 5.0"` (pessimistic constraint). To upgrade: update the version constraint, run `terraform init -upgrade`, run `terraform plan` to verify no unexpected changes, review the provider changelog for breaking changes, then apply. Use `.terraform.lock.hcl` for reproducible builds.

**Q33:** What is `terraform console`?

> `terraform console` opens an interactive REPL for evaluating Terraform expressions against the current state and configuration. Useful for testing functions (`cidrsubnet`, `lookup`, `merge`), debugging interpolations, and exploring data source results.

**Q34:** What is the difference between `terraform refresh` and `terraform plan -refresh-only`?

> `terraform refresh` (deprecated) updates state to match real infrastructure silently. `terraform plan -refresh-only` does the same but shows you what changed and asks for confirmation before modifying state. The `-refresh-only` mode is safer and preferred.

**Q35:** How do you handle Terraform in a CI/CD pipeline?

> Typical pipeline: (1) `terraform fmt -check` — enforce formatting, (2) `terraform init` — initialize, (3) `terraform validate` — syntax check, (4) `terraform plan -out=tfplan` — generate plan, (5) manual approval step, (6) `terraform apply tfplan` — apply approved plan. Store the plan artifact between stages. Use remote state with locking. Never run `apply -auto-approve` without prior plan review.

---

### Advanced (Q36–Q50)

**Q36:** Compare Terraform vs CloudFormation vs Pulumi.

> | Feature | Terraform | CloudFormation | Pulumi |
> |---|---|---|---|
> | Language | HCL | JSON/YAML | Python, TS, Go, C# |
> | Multi-Cloud | Yes | AWS only | Yes |
> | State | Self-managed or Terraform Cloud | AWS-managed | Pulumi Cloud or self-managed |
> | Drift Detection | `plan -refresh-only` | Drift detection feature | `pulumi refresh` |
> | Learning Curve | Moderate (HCL) | Low (YAML) | Low (familiar languages) |
> | Modularity | Modules | Nested stacks | Components |
> | Community | Very large | AWS-focused | Growing |

**Q37:** What are Sentinel policies in Terraform Enterprise/Cloud?

> Sentinel is HashiCorp's **policy-as-code** framework for Terraform Cloud/Enterprise. It enforces governance rules before `apply` — for example: all S3 buckets must have encryption enabled, instances must use approved AMI IDs, no resources in restricted regions. Sentinel policies are written in the Sentinel language and can be advisory (warn), soft mandatory (overridable), or hard mandatory (blocking).

**Q38:** Explain Terraform Cloud and its benefits over open-source Terraform.

> Terraform Cloud provides: remote state management with built-in locking, a **VCS-driven workflow** (auto plan on PR), **Sentinel policies** for governance, **private module registry**, **team management** and RBAC, cost estimation, run history and audit logs. It eliminates the need to manage state backends and CI/CD for Terraform yourself.

**Q39:** How do you handle state file conflicts in a team?

> Use **remote state with locking** (S3 + DynamoDB). If a lock is stuck from a crashed process, use `terraform force-unlock <LOCK_ID>`. Avoid multiple people running apply simultaneously. Use CI/CD as the single point of apply. If state diverges, use `terraform state pull` and `terraform state push` carefully to reconcile.

**Q40:** What are dynamic blocks, and when are they useful?

> Dynamic blocks generate repeated nested blocks inside a resource based on a variable (list/map). Useful when the number of nested blocks (e.g., `ingress` rules in a security group) is determined at runtime. They accept `for_each`, `content`, and `labels` arguments. Overuse reduces readability — prefer them only when the block count is truly variable.

**Q41:** Explain the Terraform dependency graph and `terraform graph`.

> Terraform builds a **directed acyclic graph (DAG)** of all resources and their dependencies. This determines the order of creation, update, and destruction. Independent resources are processed in parallel. `terraform graph` outputs the graph in DOT format, which can be visualized with Graphviz. Understanding the graph helps debug dependency issues and optimize parallelism.

**Q42:** How do you handle secrets in the Terraform state file?

> Terraform state stores all attribute values in plain text, including sensitive ones (database passwords, API keys). Mitigations: (1) encrypt state at rest (S3 SSE-KMS), (2) restrict access with IAM policies, (3) use `sensitive = true` to suppress CLI output (does NOT encrypt state), (4) avoid passing secrets as Terraform variables — instead, let resources generate secrets or reference external secret stores, (5) use Terraform Cloud which encrypts state at rest.

**Q43:** What is the `moved` block in Terraform?

> Introduced in Terraform 1.1, the `moved` block allows you to **refactor** resource addresses without destroying and recreating resources. When you rename a resource or move it into/out of a module, add a `moved` block to inform Terraform of the change. This updates state automatically on the next apply.
>
> ```hcl
> moved {
>   from = aws_instance.old_name
>   to   = aws_instance.new_name
> }
> ```

**Q44:** How do you test Terraform code?

> Testing approaches: (1) `terraform validate` for syntax, (2) `terraform plan` for logical verification, (3) **Terratest** (Go library) for integration testing — provisions real resources, validates, and destroys, (4) **terraform test** (built-in since 1.6) for native unit/integration testing with `.tftest.hcl` files, (5) **Checkov/tfsec/Trivy** for static security analysis, (6) **OPA (Open Policy Agent)** or **Sentinel** for policy checks.

**Q45:** What is the `terraform test` framework?

> Introduced in Terraform 1.6, `terraform test` runs test files (`.tftest.hcl`) that define test scenarios with `run` blocks. Each `run` block executes a plan or apply and asserts conditions. Tests can use mock providers and variable overrides. This provides native testing without external tools.
>
> ```hcl
> # tests/vpc.tftest.hcl
> run "creates_vpc" {
>   command = plan
>   assert {
>     condition     = aws_vpc.main.cidr_block == "10.0.0.0/16"
>     error_message = "VPC CIDR block is incorrect"
>   }
> }
> ```

**Q46:** Explain the `-replace` flag and when to use it.

> `terraform apply -replace="aws_instance.web"` forces Terraform to destroy and recreate a specific resource, even if no configuration change requires it. Use cases: corrupted instance needing fresh start, rotate instance for patching, test recreation logic. Unlike the deprecated `taint`, `-replace` can be previewed with `plan` and doesn't modify state prematurely.

**Q47:** How do you manage Terraform at scale across an organization?

> Strategies: (1) Use a **private module registry** for approved modules, (2) enforce **Sentinel/OPA policies** for compliance, (3) use **Terraform Cloud/Enterprise** for centralized state, runs, and RBAC, (4) **Terragrunt** for DRY multi-account/multi-region patterns, (5) separate state per component (blast radius reduction), (6) CI/CD pipelines as the only way to apply, (7) module versioning and changelogs, (8) automated drift detection.

**Q48:** What is the `check` block in Terraform?

> Introduced in Terraform 1.5, `check` blocks define **continuous validation** assertions that run during every plan/apply. Unlike preconditions/postconditions on resources, checks don't block operations — they produce warnings. Useful for verifying external dependencies (e.g., a certificate isn't expiring soon, an external API is reachable).
>
> ```hcl
> check "api_health" {
>   data "http" "api" {
>     url = "https://api.example.com/health"
>   }
>   assert {
>     condition     = data.http.api.status_code == 200
>     error_message = "API health check failed"
>   }
> }
> ```

**Q49:** How do you handle Terraform provider authentication securely in CI/CD?

> Best practices: (1) Use **OIDC federation** (GitHub Actions → AWS IAM role) instead of static credentials, (2) for AWS, use **IAM roles** with `assume_role` in the provider block, (3) store credentials in CI/CD secret stores (GitHub Secrets, Vault), (4) never commit credentials to Git, (5) use short-lived tokens, (6) in Terraform Cloud, use **dynamic provider credentials** for automatic OIDC-based auth.
>
> ```yaml
> # GitHub Actions example with OIDC
> permissions:
>   id-token: write
>   contents: read
> steps:
>   - uses: aws-actions/configure-aws-credentials@v4
>     with:
>       role-to-assume: arn:aws:iam::123456789012:role/terraform-ci
>       aws-region: us-east-1
> ```

**Q50:** Explain the concept of "blast radius" in Terraform and how to minimize it.

> Blast radius refers to the **scope of potential damage** from a bad Terraform apply. If all infrastructure is in one state file, a mistake can destroy everything. Minimization strategies: (1) **Split state** by component (networking, compute, database) and environment, (2) use `prevent_destroy` on critical resources, (3) use `-target` for focused applies, (4) require **plan review** before apply, (5) implement **Sentinel policies** to block dangerous operations, (6) use separate AWS accounts per environment, (7) enable state file versioning for rollback capability.

---

*End of Terraform Interview Preparation Notes*
