---
title: AWS Notes
layout: default
render_with_liquid: false
---
# AWS (Amazon Web Services) — DevOps Interview Preparation Notes

---

## 1. Introduction

### What is AWS?
Amazon Web Services (AWS) is a comprehensive cloud computing platform provided by Amazon. It offers over 200 fully featured services from data centers globally, including compute, storage, databases, networking, analytics, machine learning, and more.

### Global Infrastructure

| Component | Description |
|---|---|
| **Regions** | Geographical areas with multiple isolated data centers (e.g., us-east-1, eu-west-1). Choose based on latency, compliance, and cost. |
| **Availability Zones (AZs)** | Isolated data centers within a region (typically 3 per region). Connected via low-latency links. Used for high availability. |
| **Edge Locations** | Endpoints for CloudFront CDN and Route 53. Cache content closer to users for low-latency delivery. 400+ edge locations globally. |
| **Local Zones** | Extensions of AWS regions placed closer to end users for ultra-low-latency applications. |
| **Wavelength Zones** | AWS infrastructure deployed within telecom providers' data centers for 5G edge computing. |

### Shared Responsibility Model

- **AWS is responsible for**: Security **of** the cloud — hardware, software, networking, and facilities that run AWS Cloud services.
- **Customer is responsible for**: Security **in** the cloud — customer data, IAM, OS patching, firewall/network config, encryption.

```
+--------------------------------------------------+
|              Customer Responsibility              |
|  Data, IAM, OS Patching, Firewall, Encryption     |
+--------------------------------------------------+
|                AWS Responsibility                  |
|  Hardware, Software, Networking, Facilities        |
+--------------------------------------------------+
```

### AWS Free Tier

| Type | Description | Example |
|---|---|---|
| **Always Free** | Services always free within limits | Lambda (1M requests/month), DynamoDB (25 GB) |
| **12 Months Free** | Free for 12 months after signup | EC2 t2.micro (750 hrs/month), S3 (5 GB), RDS (750 hrs) |
| **Trials** | Short-term free trials for specific services | SageMaker, Inspector, GuardDuty |

---

## 2. Core Services

---

### 2.1 Compute

#### EC2 (Elastic Compute Cloud)

EC2 provides resizable virtual servers (instances) in the cloud. It is the backbone of AWS compute services.

**Instance Types:**

| Family | Purpose | Example |
|---|---|---|
| **General Purpose** | Balanced compute, memory, networking | t3, t3a, m5, m6i |
| **Compute Optimized** | High-performance processors | c5, c6i, c7g |
| **Memory Optimized** | Large in-memory datasets | r5, r6i, x1, x2idn |
| **Storage Optimized** | High sequential read/write to local storage | i3, i3en, d2, d3 |
| **Accelerated Computing** | GPU, FPGA for ML/HPC | p4d, g5, inf1, trn1 |

**Key Concepts:**

- **AMI (Amazon Machine Image)**: Template for the root volume (OS + software). Can be AWS-provided, Marketplace, or custom.
- **Key Pairs**: SSH key pairs for secure login. Public key stored by AWS, private key kept by user.
- **Security Groups**: Virtual firewalls controlling inbound/outbound traffic at the instance level. Stateful — return traffic is automatically allowed.
- **User Data**: Bootstrap scripts (bash) executed on first launch to automate instance configuration.

**Example — Launch an EC2 instance with user data:**

```bash
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type t3.micro \
  --key-name my-key-pair \
  --security-group-ids sg-0123456789abcdef0 \
  --subnet-id subnet-0123456789abcdef0 \
  --user-data '#!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
echo "<h1>Hello from EC2</h1>" > /var/www/html/index.html'
```

**Pricing Models:**

| Model | Description | Use Case |
|---|---|---|
| **On-Demand** | Pay per hour/second, no commitment | Short-term, unpredictable workloads |
| **Reserved Instances** | 1 or 3-year commitment, up to 72% discount | Steady-state workloads |
| **Spot Instances** | Bid on unused capacity, up to 90% discount | Fault-tolerant, flexible workloads |
| **Savings Plans** | Flexible pricing with commitment to usage ($/hr) | Broad compute usage across services |
| **Dedicated Hosts** | Physical server dedicated to you | Compliance, licensing requirements |

#### Lambda (Serverless Compute)

AWS Lambda runs code without provisioning or managing servers. You pay only for compute time consumed.

- **Triggers**: API Gateway, S3 events, DynamoDB Streams, SQS, SNS, CloudWatch Events, Kinesis
- **Layers**: Reusable packages of libraries, custom runtimes, or other dependencies shared across functions
- **Limits**: 15-minute max execution, 10 GB memory, 250 MB deployment package (unzipped), 1000 concurrent executions (soft limit)
- **Supported Runtimes**: Python, Node.js, Java, Go, .NET, Ruby, custom (via layers)

```bash
# Create a Lambda function
aws lambda create-function \
  --function-name my-function \
  --runtime python3.12 \
  --role arn:aws:iam::123456789012:role/lambda-role \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --memory-size 256
```

#### ECS / EKS (Containers on AWS)

| Service | Description |
|---|---|
| **ECS (Elastic Container Service)** | AWS-native container orchestration. Supports Fargate (serverless) and EC2 launch types. |
| **EKS (Elastic Kubernetes Service)** | Managed Kubernetes. Run standard K8s workloads. Supports Fargate and EC2 node groups. |

#### Elastic Beanstalk

PaaS solution that automatically handles deployment, capacity provisioning, load balancing, auto-scaling, and health monitoring. Supports Java, .NET, PHP, Node.js, Python, Ruby, Go, and Docker.

```bash
# Initialize and deploy with Elastic Beanstalk CLI
eb init my-app --platform python-3.9 --region us-east-1
eb create my-env --instance_type t3.micro
eb deploy
```

---

### 2.2 Storage

#### S3 (Simple Storage Service)

Object storage with 99.999999999% (11 nines) durability. Unlimited storage capacity.

**Key Concepts:**
- **Buckets**: Containers for objects. Globally unique names. Region-specific.
- **Versioning**: Keep multiple variants of an object. Protects against accidental deletion.
- **Lifecycle Policies**: Automate transitions between storage classes or expire objects.
- **Storage Classes**:

| Class | Description | Use Case |
|---|---|---|
| **S3 Standard** | High availability, low latency | Frequently accessed data |
| **S3 Intelligent-Tiering** | Auto-moves data between tiers | Unknown/changing access patterns |
| **S3 Standard-IA** | Lower cost, retrieval fee | Infrequent access, rapid retrieval |
| **S3 One Zone-IA** | Single AZ, lower cost | Reproducible infrequent data |
| **S3 Glacier Instant Retrieval** | Archive with millisecond retrieval | Quarterly access archives |
| **S3 Glacier Flexible Retrieval** | Archive, minutes to hours retrieval | Backup and disaster recovery |
| **S3 Glacier Deep Archive** | Lowest cost, 12-hour retrieval | Long-term compliance archives |

**Lifecycle Policy Example:**

```json
{
  "Rules": [
    {
      "ID": "MoveToGlacier",
      "Status": "Enabled",
      "Transitions": [
        { "Days": 90, "StorageClass": "GLACIER" }
      ],
      "Expiration": { "Days": 365 }
    }
  ]
}
```

#### EBS (Elastic Block Store)

Block-level storage volumes for EC2 instances. Persistent and independent of instance lifecycle.

| Type | Description | IOPS | Use Case |
|---|---|---|---|
| gp3 | General Purpose SSD | Up to 16,000 | Boot volumes, dev/test |
| io2 | Provisioned IOPS SSD | Up to 64,000 | Databases, critical apps |
| st1 | Throughput Optimized HDD | Up to 500 | Big data, log processing |
| sc1 | Cold HDD | Up to 250 | Infrequent access archives |

#### EFS (Elastic File System)

Managed NFS file system. Shared across multiple EC2 instances. Auto-scales. Supports Linux-based workloads.

#### S3 Glacier

Archive storage for long-term data retention. Lowest cost storage. Retrieval times from minutes to hours.

---

### 2.3 Networking

#### VPC (Virtual Private Cloud)

Isolated virtual network you define. Full control over IP addressing, subnets, route tables, and gateways.

**Key Components:**

| Component | Description |
|---|---|
| **Subnets** | Segments of VPC IP range. Public subnets (internet access) vs private subnets (internal only). |
| **Route Tables** | Rules determining where traffic is directed. Each subnet is associated with one route table. |
| **Internet Gateway (IGW)** | Enables communication between VPC instances and the internet. Attached to VPC. |
| **NAT Gateway** | Allows private subnet instances to access the internet without being reachable from outside. |
| **NACLs** | Stateless firewall at the subnet level. Evaluates rules in order. Supports allow and deny rules. |
| **Security Groups** | Stateful firewall at the instance level. Only allow rules. Return traffic automatically permitted. |

**NACLs vs Security Groups:**

| Feature | Security Groups | NACLs |
|---|---|---|
| Level | Instance | Subnet |
| State | Stateful | Stateless |
| Rules | Allow only | Allow & Deny |
| Evaluation | All rules evaluated | Rules evaluated in order |
| Default | Deny all inbound, allow all outbound | Allow all inbound & outbound |

**VPC Architecture Example:**

```
+------------------------------------------------------+
|  VPC (10.0.0.0/16)                                   |
|                                                       |
|  +------------------+    +---------------------+      |
|  | Public Subnet    |    | Public Subnet       |      |
|  | 10.0.1.0/24     |    | 10.0.2.0/24         |      |
|  | AZ-a            |    | AZ-b                |      |
|  | [ALB] [NAT GW]  |    | [ALB]               |      |
|  +------------------+    +---------------------+      |
|                                                       |
|  +------------------+    +---------------------+      |
|  | Private Subnet   |    | Private Subnet      |      |
|  | 10.0.3.0/24     |    | 10.0.4.0/24         |      |
|  | AZ-a            |    | AZ-b                |      |
|  | [EC2 App]       |    | [EC2 App]           |      |
|  +------------------+    +---------------------+      |
|                                                       |
|  +------------------+    +---------------------+      |
|  | DB Subnet        |    | DB Subnet           |      |
|  | 10.0.5.0/24     |    | 10.0.6.0/24         |      |
|  | AZ-a            |    | AZ-b                |      |
|  | [RDS Primary]   |    | [RDS Standby]       |      |
|  +------------------+    +---------------------+      |
+------------------------------------------------------+
```

#### Route 53

AWS DNS service. Supports domain registration, DNS routing, and health checking.

**Routing Policies**: Simple, Weighted, Latency-based, Failover, Geolocation, Geoproximity, Multivalue Answer.

#### CloudFront

Global CDN service. Distributes content via edge locations. Supports static/dynamic content, video streaming, and API acceleration. Integrates with S3, ALB, EC2, and Lambda@Edge.

#### ALB / NLB

| Load Balancer | Layer | Protocol | Use Case |
|---|---|---|---|
| **ALB (Application)** | Layer 7 | HTTP/HTTPS | Path/host-based routing, microservices |
| **NLB (Network)** | Layer 4 | TCP/UDP/TLS | Ultra-low latency, high throughput |
| **GLB (Gateway)** | Layer 3 | IP | Third-party virtual appliances |

#### VPC Peering & Transit Gateway

- **VPC Peering**: Direct connection between two VPCs. Non-transitive. Works cross-region and cross-account.
- **Transit Gateway**: Hub-and-spoke model connecting thousands of VPCs, on-premises networks, and VPN connections through a central gateway.

---

### 2.4 Database

| Service | Type | Description |
|---|---|---|
| **RDS** | Relational | Managed SQL databases (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server). Multi-AZ for HA, read replicas for scaling. |
| **Aurora** | Relational | MySQL/PostgreSQL compatible, 5x faster than MySQL. Auto-scales storage up to 128 TB. Serverless option available. |
| **DynamoDB** | NoSQL | Key-value and document database. Single-digit millisecond latency. Auto-scaling. Global Tables for multi-region replication. |
| **ElastiCache** | In-Memory | Managed Redis or Memcached. Sub-millisecond latency. Caching, session storage, real-time analytics. |

**RDS Multi-AZ vs Read Replica:**

| Feature | Multi-AZ | Read Replica |
|---|---|---|
| Purpose | High availability | Read scaling |
| Replication | Synchronous | Asynchronous |
| Failover | Automatic | Manual promotion |
| Region | Same region | Cross-region supported |

---

### 2.5 Security & Identity

#### IAM (Identity and Access Management)

- **Users**: Individual identities with long-term credentials (password, access keys).
- **Groups**: Collection of users. Attach policies to groups, not individual users.
- **Roles**: Temporary credentials for AWS services, cross-account access, or federation. No long-term credentials.
- **Policies**: JSON documents defining permissions. Types: AWS Managed, Customer Managed, Inline.

**IAM Policy Example:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::my-bucket/*"
    },
    {
      "Effect": "Deny",
      "Action": "s3:DeleteObject",
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

**IAM Best Practices:**
- Enable MFA for all users, especially root account
- Use roles instead of access keys wherever possible
- Apply the principle of least privilege
- Use IAM Access Analyzer to review permissions
- Rotate credentials regularly
- Never embed access keys in code

#### Other Security Services

| Service | Description |
|---|---|
| **KMS** | Managed encryption keys. Create, control, and rotate keys. Integrates with S3, EBS, RDS, etc. |
| **Secrets Manager** | Store and auto-rotate secrets (DB passwords, API keys). Integrates with RDS for automatic rotation. |
| **WAF** | Web Application Firewall. Protects against SQL injection, XSS, and other web exploits. Works with ALB, CloudFront, API Gateway. |
| **Shield** | DDoS protection. Standard (free, automatic) and Advanced (paid, 24/7 DDoS response team). |
| **GuardDuty** | Intelligent threat detection using ML. Monitors CloudTrail, VPC Flow Logs, and DNS Logs. |
| **Inspector** | Automated security assessment for EC2 instances and container images. |

---

### 2.6 Monitoring

#### CloudWatch

Unified monitoring and observability service.

- **Metrics**: CPU, memory, disk, network for AWS resources. Custom metrics via PutMetricData API.
- **Logs**: Centralize logs from EC2, Lambda, ECS, and on-premises. Log groups, log streams, metric filters.
- **Alarms**: Trigger actions based on metric thresholds. Actions: SNS, Auto Scaling, EC2 actions.
- **Dashboards**: Custom visual displays of metrics and alarms. Shareable, cross-account, cross-region.

```bash
# Create a CloudWatch alarm for high CPU
aws cloudwatch put-metric-alarm \
  --alarm-name "HighCPU" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:my-topic \
  --dimensions Name=InstanceId,Value=i-0123456789abcdef0
```

#### CloudTrail

Records all API calls across your AWS account. Essential for governance, compliance, and auditing.

- Logs who did what, when, and from where
- Can deliver logs to S3 and CloudWatch Logs
- Supports multi-region and organization-level trails

#### X-Ray

Distributed tracing service. Analyze and debug distributed applications. Visualize service maps, identify bottlenecks, and trace requests across microservices.

---

### 2.7 CI/CD Services

| Service | Description |
|---|---|
| **CodeCommit** | Managed Git repositories. Private, encrypted, highly available. Integrates with IAM for access control. |
| **CodeBuild** | Fully managed build service. Compiles code, runs tests, produces artifacts. Uses buildspec.yml. |
| **CodeDeploy** | Automated deployment to EC2, Lambda, ECS. Supports rolling, blue/green, and canary deployments. |
| **CodePipeline** | CI/CD orchestration. Automates build, test, and deploy phases. Integrates with GitHub, CodeCommit, Jenkins. |

**buildspec.yml Example:**

```yaml
version: 0.2
phases:
  install:
    runtime-versions:
      python: 3.12
    commands:
      - pip install -r requirements.txt
  pre_build:
    commands:
      - echo "Running tests..."
      - pytest tests/
  build:
    commands:
      - echo "Building application..."
      - python setup.py build
  post_build:
    commands:
      - echo "Build completed on $(date)"
artifacts:
  files:
    - '**/*'
  base-directory: dist
```

**CodePipeline Structure:**

```
Source (CodeCommit/GitHub)
   ↓
Build (CodeBuild)
   ↓
Test (CodeBuild)
   ↓
Deploy Staging (CodeDeploy)
   ↓
Manual Approval
   ↓
Deploy Production (CodeDeploy)
```

---

### 2.8 Messaging

| Service | Type | Description |
|---|---|---|
| **SNS** | Pub/Sub | Push-based messaging. Sends notifications to subscribers (email, SMS, HTTP, SQS, Lambda). Fan-out pattern. |
| **SQS** | Queue | Pull-based message queuing. Decouples producers and consumers. Standard (at-least-once, best-effort ordering) vs FIFO (exactly-once, ordered). |
| **EventBridge** | Event Bus | Serverless event routing. Connects applications using events from AWS services, SaaS, and custom sources. Supports rules, filtering, and transformation. |

**SNS + SQS Fan-Out Pattern:**

```
Producer → SNS Topic → SQS Queue 1 → Consumer A
                      → SQS Queue 2 → Consumer B
                      → Lambda       → Consumer C
```

---

### 2.9 Infrastructure as Code

#### CloudFormation

AWS-native IaC service. Define infrastructure as YAML/JSON templates. Manages stacks (collections of resources).

**Key Concepts:**
- **Templates**: YAML/JSON files describing AWS resources.
- **Stacks**: Provisioned set of resources from a template.
- **Change Sets**: Preview changes before executing them.
- **Drift Detection**: Identify resources that have changed outside of CloudFormation.
- **StackSets**: Deploy stacks across multiple accounts and regions.

**CloudFormation Template Example:**

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: Simple EC2 with Security Group

Parameters:
  InstanceType:
    Type: String
    Default: t3.micro
    AllowedValues: [t3.micro, t3.small, t3.medium]
  KeyName:
    Type: AWS::EC2::KeyPair::KeyName

Resources:
  WebServerSG:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Allow HTTP and SSH
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 0.0.0.0/0

  WebServer:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: !Ref InstanceType
      KeyName: !Ref KeyName
      ImageId: ami-0abcdef1234567890
      SecurityGroupIds:
        - !Ref WebServerSG
      UserData:
        Fn::Base64: |
          #!/bin/bash
          yum update -y
          yum install -y httpd
          systemctl start httpd

Outputs:
  PublicIP:
    Description: Public IP of the web server
    Value: !GetAtt WebServer.PublicIp
  InstanceId:
    Description: Instance ID
    Value: !Ref WebServer
```

---

### 2.10 Containers

| Service | Description |
|---|---|
| **ECR (Elastic Container Registry)** | Managed Docker container registry. Store, manage, and deploy container images. Integrates with ECS and EKS. Supports image scanning. |
| **ECS (Elastic Container Service)** | AWS-native container orchestration. Task Definitions define containers. Services manage desired count and load balancing. |
| **EKS (Elastic Kubernetes Service)** | Managed Kubernetes control plane. Standard K8s API. Supports Fargate and EC2 node groups. |

**ECS: Fargate vs EC2 Launch Type:**

| Feature | Fargate | EC2 |
|---|---|---|
| Infrastructure | Serverless, no instances to manage | You manage EC2 instances |
| Scaling | Per-task scaling | Cluster auto-scaling needed |
| Pricing | Per vCPU/memory per second | EC2 instance pricing |
| Control | Less control, more managed | Full OS/instance access |
| Use Case | Variable workloads, simplicity | GPU, custom AMIs, cost optimization |

**ECS Task Definition Example:**

```json
{
  "family": "my-web-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "web",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/my-web-app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

---

## 3. Practical Examples — AWS CLI Commands

### Launch an EC2 Instance

```bash
# Create a key pair
aws ec2 create-key-pair --key-name my-key --query 'KeyMaterial' --output text > my-key.pem
chmod 400 my-key.pem

# Launch instance
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type t3.micro \
  --key-name my-key \
  --security-group-ids sg-0123456789abcdef0 \
  --subnet-id subnet-0123456789abcdef0 \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=MyWebServer}]'

# Check instance status
aws ec2 describe-instances --instance-ids i-0123456789abcdef0 --query 'Reservations[0].Instances[0].State.Name'
```

### Create an S3 Bucket

```bash
# Create bucket
aws s3 mb s3://my-unique-bucket-name-2026 --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning --bucket my-unique-bucket-name-2026 \
  --versioning-configuration Status=Enabled

# Upload a file
aws s3 cp myfile.txt s3://my-unique-bucket-name-2026/

# Sync a directory
aws s3 sync ./my-folder s3://my-unique-bucket-name-2026/my-folder

# Set lifecycle policy
aws s3api put-bucket-lifecycle-configuration --bucket my-unique-bucket-name-2026 \
  --lifecycle-configuration file://lifecycle.json
```

### Create a VPC

```bash
# Create VPC
VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query 'Vpc.VpcId' --output text)
aws ec2 create-tags --resources $VPC_ID --tags Key=Name,Value=MyVPC

# Create public subnet
SUBNET_PUB=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a --query 'Subnet.SubnetId' --output text)

# Create Internet Gateway and attach
IGW_ID=$(aws ec2 create-internet-gateway --query 'InternetGateway.InternetGatewayId' --output text)
aws ec2 attach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID

# Create route table and add route
RTB_ID=$(aws ec2 create-route-table --vpc-id $VPC_ID --query 'RouteTable.RouteTableId' --output text)
aws ec2 create-route --route-table-id $RTB_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID
aws ec2 associate-route-table --route-table-id $RTB_ID --subnet-id $SUBNET_PUB
```

### Create an IAM Role

```bash
# Create trust policy file
cat > trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "ec2.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create role
aws iam create-role --role-name EC2-S3-Access \
  --assume-role-policy-document file://trust-policy.json

# Attach policy
aws iam attach-role-policy --role-name EC2-S3-Access \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess

# Create instance profile and add role
aws iam create-instance-profile --instance-profile-name EC2-S3-Profile
aws iam add-role-to-instance-profile --instance-profile-name EC2-S3-Profile --role-name EC2-S3-Access
```

### Create a Lambda Function

```bash
# Create function code
cat > lambda_function.py << 'EOF'
import json

def lambda_handler(event, context):
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'message': 'Hello from Lambda!'})
    }
EOF

# Package and deploy
zip function.zip lambda_function.py

aws lambda create-function \
  --function-name HelloFunction \
  --runtime python3.12 \
  --role arn:aws:iam::123456789012:role/lambda-execution-role \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://function.zip

# Invoke the function
aws lambda invoke --function-name HelloFunction output.json
cat output.json
```

---

## 4. Cheat Sheet

| Category | Service | One-Line Description |
|---|---|---|
| **Compute** | EC2 | Virtual servers in the cloud |
| **Compute** | Lambda | Serverless function execution |
| **Compute** | ECS | Container orchestration (AWS-native) |
| **Compute** | EKS | Managed Kubernetes service |
| **Compute** | Elastic Beanstalk | PaaS for web apps (auto-managed infra) |
| **Compute** | Fargate | Serverless compute engine for containers |
| **Storage** | S3 | Object storage with 11-nines durability |
| **Storage** | EBS | Block storage volumes for EC2 |
| **Storage** | EFS | Managed NFS file system |
| **Storage** | S3 Glacier | Low-cost archive storage |
| **Networking** | VPC | Isolated virtual network |
| **Networking** | Route 53 | DNS and domain registration |
| **Networking** | CloudFront | Global CDN |
| **Networking** | ALB | Layer 7 load balancer (HTTP/HTTPS) |
| **Networking** | NLB | Layer 4 load balancer (TCP/UDP) |
| **Networking** | Transit Gateway | Hub for connecting VPCs and on-premises |
| **Database** | RDS | Managed relational databases |
| **Database** | Aurora | High-performance MySQL/PostgreSQL compatible |
| **Database** | DynamoDB | Managed NoSQL key-value and document DB |
| **Database** | ElastiCache | In-memory caching (Redis/Memcached) |
| **Security** | IAM | Identity and access management |
| **Security** | KMS | Managed encryption keys |
| **Security** | Secrets Manager | Store and rotate secrets |
| **Security** | WAF | Web application firewall |
| **Security** | Shield | DDoS protection |
| **Monitoring** | CloudWatch | Metrics, logs, alarms, dashboards |
| **Monitoring** | CloudTrail | API call auditing and logging |
| **Monitoring** | X-Ray | Distributed application tracing |
| **CI/CD** | CodeCommit | Managed Git repositories |
| **CI/CD** | CodeBuild | Managed build service |
| **CI/CD** | CodeDeploy | Automated deployment service |
| **CI/CD** | CodePipeline | CI/CD pipeline orchestrator |
| **Messaging** | SNS | Pub/sub notification service |
| **Messaging** | SQS | Managed message queuing |
| **Messaging** | EventBridge | Serverless event bus |
| **IaC** | CloudFormation | Infrastructure as code (AWS-native) |
| **Containers** | ECR | Docker container image registry |

---

## 5. Hands-on Labs

### Lab 1: Deploy a 3-Tier Web Application (VPC + EC2 + RDS)

**Objective:** Create a production-style architecture with separate web, app, and database tiers.

**Steps:**

1. **Create VPC with subnets:**
```bash
# VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=ThreeTierVPC}]'

# Public subnets (web tier)
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.2.0/24 --availability-zone us-east-1b

# Private subnets (app tier)
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.3.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.4.0/24 --availability-zone us-east-1b

# DB subnets
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.5.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.6.0/24 --availability-zone us-east-1b
```

2. **Create ALB in public subnets:**
```bash
aws elbv2 create-load-balancer --name web-alb --type application \
  --subnets subnet-pub1 subnet-pub2 --security-groups sg-alb
```

3. **Launch EC2 instances in private subnets with Auto Scaling Group.**

4. **Create RDS Multi-AZ in DB subnets:**
```bash
aws rds create-db-subnet-group --db-subnet-group-name my-db-subnet \
  --subnet-ids subnet-db1 subnet-db2

aws rds create-db-instance --db-instance-identifier mydb \
  --db-instance-class db.t3.micro --engine mysql \
  --master-username admin --master-user-password 'SecurePass123!' \
  --allocated-storage 20 --multi-az \
  --db-subnet-group-name my-db-subnet --vpc-security-group-ids sg-db
```

---

### Lab 2: Build a Serverless API (API Gateway + Lambda + DynamoDB)

**Objective:** Create a REST API that performs CRUD operations on a DynamoDB table.

1. **Create DynamoDB table:**
```bash
aws dynamodb create-table --table-name Items \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

2. **Create Lambda function:**
```python
# lambda_function.py
import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Items')

def lambda_handler(event, context):
    http_method = event['httpMethod']
    
    if http_method == 'GET':
        response = table.scan()
        return {'statusCode': 200, 'body': json.dumps(response['Items'], default=str)}
    
    elif http_method == 'POST':
        body = json.loads(event['body'])
        table.put_item(Item=body)
        return {'statusCode': 201, 'body': json.dumps({'message': 'Item created'})}
    
    elif http_method == 'DELETE':
        item_id = event['pathParameters']['id']
        table.delete_item(Key={'id': item_id})
        return {'statusCode': 200, 'body': json.dumps({'message': 'Item deleted'})}
```

3. **Create API Gateway and connect to Lambda.**

4. **Test the API:**
```bash
curl -X POST https://abc123.execute-api.us-east-1.amazonaws.com/prod/items \
  -H "Content-Type: application/json" \
  -d '{"id": "1", "name": "Widget", "price": 9.99}'

curl https://abc123.execute-api.us-east-1.amazonaws.com/prod/items
```

---

### Lab 3: Set Up CI/CD with CodePipeline

**Objective:** Automate build and deployment using AWS native CI/CD tools.

1. **Create CodeCommit repository:**
```bash
aws codecommit create-repository --repository-name my-app
```

2. **Create `buildspec.yml` in repo root** (see Section 2.7).

3. **Create CodeBuild project:**
```bash
aws codebuild create-project --name my-build \
  --source type=CODECOMMIT,location=https://git-codecommit.us-east-1.amazonaws.com/v1/repos/my-app \
  --artifacts type=S3,location=my-artifact-bucket \
  --environment type=LINUX_CONTAINER,computeType=BUILD_GENERAL1_SMALL,image=aws/codebuild/amazonlinux2-x86_64-standard:5.0 \
  --service-role arn:aws:iam::123456789012:role/codebuild-role
```

4. **Create CodePipeline:**
```bash
aws codepipeline create-pipeline --cli-input-json file://pipeline.json
```

```json
{
  "pipeline": {
    "name": "my-pipeline",
    "roleArn": "arn:aws:iam::123456789012:role/codepipeline-role",
    "stages": [
      {
        "name": "Source",
        "actions": [{
          "name": "SourceAction",
          "actionTypeId": { "category": "Source", "owner": "AWS", "provider": "CodeCommit", "version": "1" },
          "configuration": { "RepositoryName": "my-app", "BranchName": "main" },
          "outputArtifacts": [{ "name": "SourceOutput" }]
        }]
      },
      {
        "name": "Build",
        "actions": [{
          "name": "BuildAction",
          "actionTypeId": { "category": "Build", "owner": "AWS", "provider": "CodeBuild", "version": "1" },
          "configuration": { "ProjectName": "my-build" },
          "inputArtifacts": [{ "name": "SourceOutput" }],
          "outputArtifacts": [{ "name": "BuildOutput" }]
        }]
      },
      {
        "name": "Deploy",
        "actions": [{
          "name": "DeployAction",
          "actionTypeId": { "category": "Deploy", "owner": "AWS", "provider": "CodeDeploy", "version": "1" },
          "configuration": { "ApplicationName": "my-app", "DeploymentGroupName": "my-deploy-group" },
          "inputArtifacts": [{ "name": "BuildOutput" }]
        }]
      }
    ]
  }
}
```

---

## 6. Real-world Scenarios

### Scenario 1: Design a Highly Available, Fault-Tolerant Architecture

**Requirements:** A web application that must sustain AZ failures and handle variable traffic.

**Solution:**
- **Multi-AZ deployment** across at least 2 AZs
- **ALB** in public subnets distributing traffic to an **Auto Scaling Group**
- **EC2 instances** in private subnets with min=2, desired=4, max=10
- **RDS Multi-AZ** with automatic failover for the database
- **ElastiCache Redis** cluster for session management and caching
- **S3** for static assets served via **CloudFront**
- **Route 53** with health checks and failover routing
- **CloudWatch alarms** triggering Auto Scaling policies

**Auto Scaling Policy:**
```bash
aws autoscaling put-scaling-policy \
  --auto-scaling-group-name my-asg \
  --policy-name scale-out \
  --policy-type TargetTrackingScaling \
  --target-tracking-configuration '{
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ASGAverageCPUUtilization"
    }
  }'
```

---

### Scenario 2: Migrate an On-Premises Application to AWS

**Strategy: The 6 Rs of Migration**

| Strategy | Description |
|---|---|
| **Rehost** (Lift & Shift) | Move as-is to EC2. Fastest. Minimal changes. |
| **Replatform** (Lift & Reshape) | Minor optimizations (e.g., move DB to RDS). |
| **Repurchase** | Switch to SaaS (e.g., CRM to Salesforce). |
| **Refactor** | Re-architect for cloud-native (e.g., microservices on ECS/Lambda). |
| **Retire** | Decommission unused applications. |
| **Retain** | Keep on-premises (compliance, not ready). |

**Migration Steps:**
1. **Discover** — AWS Application Discovery Service to assess current state
2. **Plan** — Use AWS Migration Hub to track migration progress
3. **Migrate** — AWS Server Migration Service (SMS) for VM replication
4. **Modernize** — Containerize with ECS, go serverless with Lambda, use managed databases

---

### Scenario 3: Cost Optimization Strategies

| Strategy | Description |
|---|---|
| **Right-size instances** | Use AWS Compute Optimizer to identify underutilized instances |
| **Use Reserved Instances / Savings Plans** | Commit to 1-3 year terms for up to 72% savings |
| **Spot Instances** | Use for fault-tolerant workloads (batch, CI/CD, testing) |
| **S3 Lifecycle Policies** | Move infrequently accessed data to cheaper storage tiers |
| **Auto Scaling** | Scale in during low demand to avoid paying for idle resources |
| **Delete unused resources** | Unattached EBS volumes, unused Elastic IPs, old snapshots |
| **Use AWS Cost Explorer** | Analyze spend patterns and identify savings opportunities |
| **Set budget alerts** | AWS Budgets to notify when costs exceed thresholds |
| **Use Graviton instances** | ARM-based instances offer up to 40% better price-performance |

```bash
# Find unattached EBS volumes
aws ec2 describe-volumes --filters Name=status,Values=available \
  --query 'Volumes[*].[VolumeId,Size,CreateTime]' --output table

# Find unused Elastic IPs
aws ec2 describe-addresses --query 'Addresses[?AssociationId==null].[PublicIp,AllocationId]' --output table
```

---

## 7. Interview Q&A

### Basic (Q1–Q15)

**Q1: What is AWS and why is it used?**
> AWS is a cloud computing platform by Amazon offering 200+ services (compute, storage, databases, networking, etc.). It's used to reduce infrastructure costs, scale on demand, improve reliability, and accelerate innovation. Pay-as-you-go pricing eliminates upfront capital expenditure.

**Q2: What are AWS Regions and Availability Zones?**
> A Region is a separate geographic area (e.g., us-east-1). Each Region contains multiple isolated Availability Zones (AZs) — distinct data centers with independent power, networking, and connectivity. AZs within a Region are connected via low-latency links. This design enables high availability and fault tolerance.

**Q3: Explain the Shared Responsibility Model.**
> AWS manages security **of** the cloud (physical infrastructure, hypervisor, managed services), while the customer manages security **in** the cloud (data encryption, IAM, OS patching, network configuration, application security). The line shifts depending on the service — more customer responsibility for EC2 (IaaS) vs less for Lambda (serverless).

**Q4: What are the different EC2 instance types?**
> General Purpose (t3, m5) for balanced workloads, Compute Optimized (c5) for CPU-intensive tasks, Memory Optimized (r5, x1) for in-memory databases, Storage Optimized (i3, d2) for data warehousing, and Accelerated Computing (p4d, g5) for ML/GPU workloads. Choose based on the workload's resource profile.

**Q5: What is an AMI?**
> An Amazon Machine Image (AMI) is a template containing the OS, application server, and applications used to launch EC2 instances. AMIs can be AWS-provided, from the Marketplace, community-shared, or custom-built. They are region-specific but can be copied across regions.

**Q6: What is S3 and what are its storage classes?**
> S3 is object storage with 99.999999999% durability. Storage classes include: Standard (frequent access), Intelligent-Tiering (auto-tiering), Standard-IA and One Zone-IA (infrequent access), Glacier Instant Retrieval, Glacier Flexible Retrieval, and Glacier Deep Archive (archival). Each offers different cost/access time tradeoffs.

**Q7: What is a VPC?**
> A Virtual Private Cloud (VPC) is a logically isolated virtual network in AWS where you launch resources. You control the IP range (CIDR block), subnets, route tables, internet/NAT gateways, and security (Security Groups, NACLs). It is the foundation of AWS networking.

**Q8: What is IAM and what are its components?**
> IAM (Identity and Access Management) controls who can access what in AWS. Components: Users (individual identities), Groups (collection of users), Roles (temporary credentials for services/cross-account access), Policies (JSON documents defining permissions). Follow least privilege principle.

**Q9: What is the difference between Security Groups and NACLs?**
> Security Groups are stateful, instance-level firewalls with only allow rules. NACLs are stateless, subnet-level firewalls with both allow and deny rules evaluated in order. Security Groups are the primary defense; NACLs add an extra layer at the subnet boundary.

**Q10: What is CloudWatch?**
> CloudWatch is a monitoring and observability service. It collects metrics (CPU, memory, custom), stores logs (from EC2, Lambda, containers), triggers alarms based on thresholds, and provides dashboards. It's the central place for monitoring AWS resource health and application performance.

**Q11: What is Route 53?**
> Route 53 is AWS's DNS service. It provides domain registration, DNS routing, and health checking. Routing policies include Simple, Weighted, Latency-based, Failover, Geolocation, and Multivalue Answer. Named after DNS port 53.

**Q12: What is Elastic Beanstalk?**
> Elastic Beanstalk is a PaaS that automatically handles deployment, capacity provisioning, load balancing, and health monitoring. You upload your code and it manages the underlying infrastructure. Supports multiple platforms (Java, Python, Node.js, Docker, etc.). You retain full control of the underlying resources.

**Q13: What is CloudFormation?**
> CloudFormation is AWS's Infrastructure as Code (IaC) service. You define resources in YAML/JSON templates, and CloudFormation provisions and manages them as stacks. Supports change sets for previewing changes, drift detection, and rollback on failure.

**Q14: What are EBS volume types?**
> gp3/gp2 (General Purpose SSD) for boot volumes and general workloads, io2/io1 (Provisioned IOPS SSD) for databases requiring consistent performance, st1 (Throughput Optimized HDD) for big data and streaming, sc1 (Cold HDD) for infrequently accessed data.

**Q15: What is the AWS Free Tier?**
> AWS Free Tier provides three types of offers: Always Free (Lambda 1M requests/month, DynamoDB 25 GB), 12 Months Free (EC2 t2.micro 750 hrs/month, S3 5 GB, RDS 750 hrs), and Trials (short-term trials for specific services). Helps beginners learn and experiment without cost.

---

### Intermediate (Q16–Q35)

**Q16: Explain the difference between On-Demand, Reserved, and Spot instances.**
> On-Demand: pay per second, no commitment, most flexible but most expensive. Reserved: 1-3 year commitment, up to 72% discount, best for steady workloads. Spot: bid on unused capacity, up to 90% discount, can be reclaimed with 2-minute notice, best for fault-tolerant batch jobs and CI/CD.

**Q17: How does Auto Scaling work?**
> Auto Scaling automatically adjusts the number of EC2 instances based on demand. It uses a Launch Template (instance config), an Auto Scaling Group (min/max/desired counts), and Scaling Policies (target tracking, step, or simple). CloudWatch alarms trigger scaling actions. Supports scheduled scaling for predictable patterns.

**Q18: What is a Lambda Layer and why use it?**
> A Lambda Layer is a ZIP archive containing libraries, dependencies, or custom runtimes shared across multiple Lambda functions. Benefits: reduces deployment package size, promotes code reuse, simplifies dependency management. Up to 5 layers per function, 250 MB total unzipped limit.

**Q19: Explain S3 versioning and lifecycle policies.**
> Versioning keeps multiple variants of objects, protecting against accidental deletes (objects get a delete marker, not permanently removed). Lifecycle policies automate transitions between storage classes (e.g., Standard → IA after 30 days → Glacier after 90 days → Delete after 365 days), reducing costs for aging data.

**Q20: What is VPC Peering and what are its limitations?**
> VPC Peering creates a private connection between two VPCs using AWS's backbone network. Limitations: non-transitive (if A peers with B and B with C, A cannot reach C through B), no overlapping CIDR ranges, and no edge-to-edge routing through the peering connection. Use Transit Gateway for complex topologies.

**Q21: Explain RDS Multi-AZ vs Read Replicas.**
> Multi-AZ provides high availability — a synchronous standby in another AZ with automatic failover (same endpoint). Read Replicas provide read scaling — asynchronous replication, separate endpoint, can be cross-region. Multi-AZ for disaster recovery, Read Replicas for performance. They can be combined.

**Q22: What is DynamoDB and when would you use it?**
> DynamoDB is a fully managed NoSQL database providing single-digit millisecond latency at any scale. Use it for high-throughput, low-latency workloads: session stores, gaming leaderboards, IoT data, shopping carts. Supports key-value and document models, global tables for multi-region, and DynamoDB Streams for change data capture.

**Q23: How do you secure an S3 bucket?**
> Block public access at account/bucket level, use bucket policies and IAM policies for access control, enable server-side encryption (SSE-S3, SSE-KMS, SSE-C), use VPC endpoints for private access, enable access logging and CloudTrail, use presigned URLs for time-limited access, and enable MFA Delete for versioned buckets.

**Q24: What is CloudTrail and how is it different from CloudWatch?**
> CloudTrail records API calls (who did what, when, from where) for auditing and compliance. CloudWatch monitors resource metrics and logs for operational health. CloudTrail answers "who changed this?" while CloudWatch answers "how is this resource performing?" Both are essential for governance.

**Q25: Explain the difference between SNS and SQS.**
> SNS is a push-based pub/sub service — messages are pushed to all subscribers immediately (fan-out). SQS is a pull-based queue — consumers poll for messages (point-to-point decoupling). SNS for broadcasting notifications, SQS for reliable async processing. They're often combined: SNS fans out to multiple SQS queues.

**Q26: What is CodePipeline and how does it work?**
> CodePipeline is a CI/CD orchestration service that automates the build, test, and deploy workflow. It consists of stages (Source, Build, Test, Deploy), each containing actions. Integrates with CodeCommit/GitHub (source), CodeBuild (build), CodeDeploy (deploy), and third-party tools. Triggered by source changes.

**Q27: How does an Application Load Balancer route traffic?**
> ALB operates at Layer 7 (HTTP/HTTPS) and routes traffic based on: host headers, URL paths, HTTP methods, query strings, and source IP. Supports target groups (EC2, IP, Lambda), sticky sessions, WebSocket, and HTTP/2. Ideal for microservices and container-based applications.

**Q28: What is a NAT Gateway and when is it needed?**
> A NAT Gateway enables instances in private subnets to access the internet (for updates, API calls) while preventing inbound connections from the internet. Placed in a public subnet with an Elastic IP. Managed, highly available within an AZ. For multi-AZ HA, deploy one per AZ.

**Q29: Explain the Well-Architected Framework pillars.**
> Six pillars: **Operational Excellence** (automate operations, learn from failures), **Security** (protect data and systems), **Reliability** (recover from failures, meet demand), **Performance Efficiency** (use resources efficiently), **Cost Optimization** (avoid unnecessary costs), **Sustainability** (minimize environmental impact).

**Q30: What is ECS and how does a Task Definition work?**
> ECS is AWS's container orchestration service. A Task Definition is a blueprint describing one or more containers: image, CPU/memory, port mappings, environment variables, logging config. Services use Task Definitions to maintain desired count and integrate with load balancers. Supports Fargate (serverless) and EC2 launch types.

**Q31: What is AWS KMS?**
> KMS (Key Management Service) creates and manages encryption keys used to encrypt data across AWS services. Supports symmetric and asymmetric keys, automatic key rotation, key policies for access control, and audit via CloudTrail. Integrated with S3, EBS, RDS, Lambda, and more.

**Q32: What is CloudFront and how does it improve performance?**
> CloudFront is a CDN that caches content at 400+ edge locations globally. It reduces latency by serving content from the nearest edge location, offloads origin traffic, provides DDoS protection (integrated with Shield), and supports HTTPS with free SSL certificates. Works with S3, ALB, EC2, and custom origins.

**Q33: Explain blue/green deployment with CodeDeploy.**
> Blue/green deployment runs two identical environments. Blue is the current production; Green is the new version. CodeDeploy shifts traffic from Blue to Green (all-at-once or gradually). If issues arise, traffic is instantly shifted back to Blue. Supported for EC2 (via ALB), Lambda (alias traffic shifting), and ECS.

**Q34: What are AWS Secrets Manager and Parameter Store? How do they differ?**
> Both store configuration data. Secrets Manager is designed for secrets (passwords, API keys) with automatic rotation, cross-account sharing, and costs per secret. Parameter Store is simpler, stores configuration values (not just secrets), supports hierarchies, and has a free tier. Choose Secrets Manager for auto-rotation; Parameter Store for general configuration.

**Q35: What is EventBridge and how does it differ from SNS?**
> EventBridge is an event bus for event-driven architectures. Unlike SNS, it supports schema discovery, content-based filtering on event payloads, integration with SaaS partners, and scheduling. EventBridge for complex routing and transformation; SNS for simple fan-out notifications.

---

### Advanced (Q36–Q50)

**Q36: How would you design a disaster recovery strategy on AWS?**
> Four strategies with increasing cost and speed: **Backup & Restore** (RPO/RTO hours, cheapest — S3 backups, AMIs), **Pilot Light** (RPO/RTO 10s of minutes — core infra running, scale up on failover), **Warm Standby** (RPO/RTO minutes — scaled-down replica running), **Multi-Site Active-Active** (RPO/RTO near-zero — full production in multiple regions). Choice depends on RTO/RPO requirements and budget.

**Q37: Explain ECS Fargate vs EKS. When would you choose one over the other?**
> ECS Fargate is simpler — AWS-native, serverless containers, no cluster management, lower operational overhead. EKS provides full Kubernetes API — portable, ecosystem-rich, supports complex scheduling and custom controllers. Choose ECS for AWS-centric, simpler workloads; EKS when you need K8s portability, multi-cloud strategy, or Kubernetes-specific features (Helm, Operators, service mesh).

**Q38: How does CloudFormation compare to Terraform?**
> CloudFormation is AWS-native, tightly integrated, free to use, supports drift detection and StackSets. Terraform is multi-cloud, has a larger provider ecosystem, uses HCL (more readable), has state management, and a strong community. CloudFormation for AWS-only environments with native integration; Terraform for multi-cloud or when you prefer HCL syntax and modular configuration.

**Q39: How do you implement zero-downtime deployments on AWS?**
> Use rolling updates with Auto Scaling (replace instances in batches), blue/green with ALB and CodeDeploy (shift traffic between target groups), canary deployments with CodeDeploy (route small percentage first), or immutable deployments with Elastic Beanstalk. For containers: ECS rolling update, blue/green with task set switching, or Lambda weighted aliases.

**Q40: What are VPC Endpoints and why are they important?**
> VPC Endpoints allow private connectivity to AWS services without traversing the internet. **Gateway Endpoints** (free) for S3 and DynamoDB — added to route tables. **Interface Endpoints** (PrivateLink, paid) for all other services — create ENIs in your subnets. They improve security (no internet exposure), reduce data transfer costs, and comply with regulations.

**Q41: How would you optimize Lambda performance?**
> Minimize cold starts: keep functions warm with provisioned concurrency, use smaller deployment packages, choose runtimes with faster startup (Python, Node.js). Optimize execution: reuse connections (initialize SDK clients outside handler), use Lambda Layers for shared dependencies, allocate more memory (proportionally increases CPU), optimize code and reduce dependencies.

**Q42: Explain AWS Transit Gateway architecture.**
> Transit Gateway acts as a regional cloud router connecting thousands of VPCs, VPN, and Direct Connect through a single hub. Supports route tables for network segmentation, inter-region peering, multicast, and ECMP for bandwidth aggregation. Replaces complex VPC peering meshes. Enables hub-and-spoke topology with centralized network management.

**Q43: How do you implement least privilege access in a large AWS organization?**
> Use AWS Organizations with SCPs (Service Control Policies) to set permission guardrails. Implement IAM roles (not users) for all service access. Use permission boundaries to delegate safely. Leverage AWS SSO/IAM Identity Center for centralized access. Employ IAM Access Analyzer to identify unused permissions. Use condition keys to restrict by IP, time, MFA, and resource tags.

**Q44: What is the difference between horizontal and vertical scaling on AWS?**
> Vertical scaling (scale up): increase instance size (t3.micro → t3.large) — limited by max instance size, requires downtime. Horizontal scaling (scale out): add more instances behind a load balancer — virtually unlimited, no downtime. AWS favors horizontal scaling: Auto Scaling Groups, read replicas, DynamoDB auto-scaling. Design stateless applications to enable horizontal scaling.

**Q45: How would you set up cross-region disaster recovery for a database?**
> For RDS: use cross-region read replicas (promote to primary during DR). For Aurora: use Aurora Global Database (1-second replication, 1-minute failover). For DynamoDB: use Global Tables (multi-region, active-active replication). Complement with automated S3 cross-region replication for backups, Route 53 failover routing, and CloudFormation StackSets for infrastructure parity.

**Q46: Explain how to secure a multi-account AWS environment.**
> Use AWS Organizations with organizational units (OUs). Apply SCPs to restrict dangerous actions. Centralize logging with CloudTrail organization trail to a dedicated security account. Use AWS Config for compliance rules across accounts. Deploy GuardDuty organization-wide. Centralize identity with IAM Identity Center. Use AWS Security Hub for aggregated findings. Isolate workloads: separate accounts for dev, staging, production, security, and logging.

**Q47: What is the difference between SQS Standard and SQS FIFO queues?**
> Standard: nearly unlimited throughput, at-least-once delivery (possible duplicates), best-effort ordering. FIFO: 300 TPS (3000 with batching), exactly-once processing, strict ordering within message groups. Use Standard for high-throughput where order doesn't matter; FIFO for financial transactions, order processing, and deduplication requirements. FIFO queue names must end with `.fifo`.

**Q48: How would you implement a cost-effective CI/CD pipeline on AWS?**
> Use CodePipeline (free for first pipeline), CodeBuild (pay per build minute — use ARM-based instances for lower cost), and CodeDeploy (free for EC2/Lambda). Use spot instances for CodeBuild. Cache dependencies in S3 to speed up builds. Use branch-level pipelines (only build on PR merge). Implement manual approval gates before production. Leverage ECR image scanning for security. Store artifacts in S3 with lifecycle policies.

**Q49: How do you troubleshoot high latency in a distributed AWS application?**
> Use X-Ray for distributed tracing to identify slow services. Check CloudWatch metrics: ALB latency, Lambda duration, RDS read/write latency, DynamoDB consumed capacity. Analyze CloudWatch Logs Insights for error patterns. Verify VPC flow logs for network issues. Check if instances are right-sized (CPU/memory utilization). Review CloudFront cache hit ratios. Enable enhanced monitoring for RDS. Use VPC Reachability Analyzer for connectivity issues.

**Q50: Describe the AWS Well-Architected Framework review process and its pillars in depth.**
> The review uses the Well-Architected Tool to evaluate workloads against six pillars: (1) **Operational Excellence** — runbooks, CI/CD, observability, IaC. (2) **Security** — IAM least privilege, encryption at rest and in transit, detective controls, incident response. (3) **Reliability** — multi-AZ/region, auto-scaling, backup/recovery, chaos engineering. (4) **Performance Efficiency** — right instance types, caching, CDN, serverless where appropriate. (5) **Cost Optimization** — right-sizing, reserved capacity, spot instances, lifecycle policies. (6) **Sustainability** — maximize utilization, use managed services, choose efficient regions. The review identifies high-risk issues (HRIs) and generates an improvement plan with priorities.

---

*End of AWS DevOps Interview Preparation Notes*
