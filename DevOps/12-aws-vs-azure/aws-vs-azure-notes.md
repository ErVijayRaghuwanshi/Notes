---
title: AWS vs Azure Notes
layout: default
render_with_liquid: false
---
# AWS vs Azure — DevOps Interview Preparation Notes

## 1. Introduction

### Why Compare AWS vs Azure?

AWS and Azure are the two dominant cloud providers, together holding over 50% of the global cloud market. As a DevOps engineer, you will inevitably work with one or both platforms. Understanding the parallels and differences is critical for:

- **Multi-cloud strategies** — Many enterprises adopt multi-cloud to avoid vendor lock-in and leverage best-of-breed services.
- **Migration projects** — Moving workloads between providers is a common enterprise initiative.
- **Interview readiness** — Interviewers frequently ask candidates to compare equivalent services and justify platform choices.
- **Architectural decisions** — Choosing the right cloud depends on existing ecosystem, team skills, compliance needs, and cost.

### Market Share (Approximate)

| Provider | Global Market Share |
|----------|-------------------|
| AWS | ~31% |
| Azure | ~25% |
| GCP | ~11% |
| Others | ~33% |

### When to Choose Which

- **Choose AWS when:** You need the broadest service catalog, your team already has AWS expertise, you need mature serverless or big data ecosystems, or you want the largest global infrastructure footprint.
- **Choose Azure when:** Your organization is heavily invested in the Microsoft ecosystem (Active Directory, Office 365, .NET), you need strong hybrid cloud capabilities with Azure Arc, or you need deep enterprise integration.
- **Choose multi-cloud when:** You want to avoid vendor lock-in, need specific best-of-breed services from each provider, or have regulatory requirements for redundancy across providers.

### Multi-Cloud Trends

- Terraform and Pulumi enable provider-agnostic IaC.
- Kubernetes (EKS/AKS) provides a portable container orchestration layer.
- Service meshes and API gateways abstract the underlying cloud.
- Organizations increasingly use a primary cloud with a secondary provider for specific workloads.

---

## 2. Service Comparison Table

| Category | AWS Service | Azure Service | Key Difference |
|----------|------------|---------------|----------------|
| **Compute — VMs** | EC2 | Azure Virtual Machines | EC2 has more instance type families; Azure integrates tightly with Windows licensing (Azure Hybrid Benefit) |
| **Compute — Serverless** | Lambda | Azure Functions | Lambda has a 15-min max timeout; Azure Functions support Durable Functions for long-running orchestrations |
| **Compute — Container Instances** | ECS (Fargate mode) | Azure Container Instances (ACI) | ACI offers per-second billing with no cluster management; Fargate runs within ECS/EKS task definitions |
| **Compute — Kubernetes** | EKS | AKS | AKS control plane is free; EKS charges $0.10/hr per cluster for the control plane |
| **Compute — PaaS** | Elastic Beanstalk | Azure App Service | App Service is more feature-rich with built-in auth, deployment slots, and custom domains; Beanstalk is thinner |
| **Compute — Batch** | AWS Batch | Azure Batch | Both provide managed batch computing; Azure Batch has tighter integration with HPC workloads |
| **Storage — Object** | S3 | Azure Blob Storage | S3 has more storage classes (6+); Blob uses Hot/Cool/Cold/Archive tiers |
| **Storage — Block** | EBS | Azure Managed Disks | Both offer SSD and HDD options; Azure Disks support shared disks for clustering |
| **Storage — File** | EFS | Azure Files | Azure Files supports both SMB and NFS; EFS is NFS only |
| **Storage — Archive** | S3 Glacier / Glacier Deep Archive | Azure Archive Storage | Glacier Deep Archive is cheaper; Azure Archive has simpler tiering via lifecycle management |
| **Storage — Transfer** | AWS Storage Gateway | Azure StorSimple / File Sync | Azure File Sync keeps on-prem file shares synced with Azure Files |
| **Networking — Virtual Network** | VPC | VNet | VPC uses Internet Gateways and NAT Gateways explicitly; VNet provides outbound connectivity by default |
| **Networking — DNS** | Route 53 | Azure DNS | Route 53 supports domain registration natively; Azure DNS does not sell domains |
| **Networking — CDN** | CloudFront | Azure CDN / Front Door | Azure Front Door combines CDN + global load balancing + WAF; CloudFront needs separate WAF configuration |
| **Networking — App Load Balancer** | ALB (Application Load Balancer) | Azure Application Gateway | App Gateway includes built-in WAF; ALB requires a separate WAF attachment |
| **Networking — Network Load Balancer** | NLB | Azure Load Balancer | Both handle Layer 4 traffic; Azure LB supports cross-region load balancing natively |
| **Networking — Dedicated Connection** | Direct Connect | ExpressRoute | ExpressRoute supports Microsoft peering for Microsoft 365; Direct Connect is AWS-only |
| **Networking — Hub-Spoke** | Transit Gateway | Azure Virtual WAN | Virtual WAN is a managed hub-spoke service; Transit Gateway requires more manual configuration |
| **Networking — Firewall** | AWS Network Firewall | Azure Firewall | Azure Firewall has built-in threat intelligence; AWS Network Firewall uses Suricata rules |
| **Database — Relational** | RDS | Azure SQL Database | Azure SQL is based on SQL Server engine; RDS supports MySQL, PostgreSQL, MariaDB, Oracle, SQL Server |
| **Database — NoSQL** | DynamoDB | Cosmos DB | Cosmos DB is multi-model (document, key-value, graph, column-family, table) with global distribution and 5 consistency levels; DynamoDB is key-value/document only |
| **Database — Cache** | ElastiCache | Azure Cache for Redis | Both support Redis; ElastiCache also supports Memcached |
| **Database — Scalable Relational** | Aurora | Azure SQL Hyperscale | Aurora supports MySQL and PostgreSQL compatibility; Hyperscale is SQL Server-based with up to 100TB |
| **Database — Data Warehouse** | Redshift | Azure Synapse Analytics | Synapse integrates Spark, SQL pools, and data integration in one service; Redshift is more focused |
| **Security — Identity** | IAM | Entra ID (Azure AD) + Azure RBAC | AWS IAM is policy-based per account; Azure uses Entra ID (enterprise directory) with RBAC at scope levels |
| **Security — Key Management** | KMS | Azure Key Vault | Key Vault stores keys, secrets, and certificates in one service; KMS is keys only (Secrets Manager is separate) |
| **Security — Secrets** | Secrets Manager | Azure Key Vault (Secrets) | AWS has a dedicated Secrets Manager service; Azure merges secrets into Key Vault |
| **Security — WAF** | AWS WAF | Azure WAF | Both offer managed rule sets; Azure WAF integrates with Application Gateway and Front Door |
| **Security — DDoS** | AWS Shield (Standard/Advanced) | Azure DDoS Protection (Basic/Standard) | Shield Advanced includes a cost protection guarantee; Azure DDoS Standard includes attack analytics |
| **Security — Threat Detection** | GuardDuty | Microsoft Defender for Cloud | Defender for Cloud covers multi-cloud (AWS/GCP too); GuardDuty is AWS-only |
| **Monitoring — Metrics/Logs** | CloudWatch | Azure Monitor | Azure Monitor integrates with Log Analytics workspaces using KQL; CloudWatch uses CloudWatch Logs Insights |
| **Monitoring — Tracing** | X-Ray | Application Insights | Application Insights is richer—includes APM, availability tests, and smart detection; X-Ray focuses on distributed tracing |
| **Monitoring — Audit** | CloudTrail | Azure Activity Log | Both log control-plane operations; CloudTrail can log data-plane events too (S3 access, Lambda invocations) |
| **CI/CD — Pipeline** | CodePipeline | Azure Pipelines | Azure Pipelines supports multi-stage YAML with approvals; CodePipeline uses a visual stage-based model |
| **CI/CD — Build** | CodeBuild | Azure Pipelines (Build) | CodeBuild is a standalone build service; Azure Pipelines merges build and release |
| **CI/CD — Deploy** | CodeDeploy | Azure Pipelines (Release) | CodeDeploy supports in-place and blue/green on EC2; Azure Pipelines uses deployment groups and stages |
| **IaC** | CloudFormation | ARM Templates / Bicep | Bicep is a cleaner DSL that compiles to ARM JSON; CloudFormation uses JSON/YAML natively |
| **Containers — Registry** | ECR | ACR | ACR supports Helm chart storage and ACR Tasks for image building; ECR is simpler and tightly integrated with ECS/EKS |
| **Containers — Serverless Containers** | ECS Fargate | Azure Container Instances | ACI is per-container-group billing; Fargate runs within the ECS/EKS ecosystem |
| **Containers — Orchestration** | EKS | AKS | AKS control plane is free and integrates with Entra ID for RBAC; EKS control plane costs $0.10/hr |
| **Messaging — Pub/Sub** | SNS | Azure Event Grid | Event Grid is event-driven with rich filtering; SNS is simpler pub/sub with fan-out |
| **Messaging — Queue** | SQS | Azure Queue Storage / Service Bus | Service Bus supports sessions, transactions, and dead-letter queues; SQS is simpler and highly scalable |
| **Messaging — Event Bus** | EventBridge | Azure Event Grid | Both are event-driven architectures; EventBridge has native SaaS integrations |
| **Serverless — Workflow** | Step Functions | Logic Apps / Durable Functions | Logic Apps is low-code with a visual designer; Step Functions uses Amazon States Language (JSON); Durable Functions is code-first |
| **Serverless — API** | API Gateway | Azure API Management (APIM) | APIM includes developer portal, API versioning, and monetization; API Gateway is lighter but supports REST, HTTP, and WebSocket |
| **Hybrid — On-Prem** | AWS Outposts | Azure Arc / Azure Stack | Azure Arc manages on-prem and multi-cloud Kubernetes clusters from Azure; Outposts puts AWS hardware in your datacenter |
| **Governance — Multi-Account** | AWS Organizations | Azure Management Groups | Both support hierarchical policies; Azure uses Management Groups → Subscriptions → Resource Groups → Resources |

---

## 3. Pricing Comparison

### Pricing Models

| Model | AWS | Azure |
|-------|-----|-------|
| **Pay-as-you-go** | Per-second (EC2 Linux), per-hour (Windows) | Per-second (most VMs), per-minute (some) |
| **Reserved** | Reserved Instances (1yr / 3yr), Savings Plans | Reserved VM Instances (1yr / 3yr), Azure Savings Plan |
| **Spot / Low-Priority** | Spot Instances (up to 90% off, can be interrupted) | Spot VMs (up to 90% off, eviction-based) |
| **Free Tier** | 12-month free tier + always-free services | 12-month free tier + always-free services |

### Free Tier Differences

| Service | AWS Free Tier | Azure Free Tier |
|---------|--------------|-----------------|
| Compute | 750 hrs/month t2.micro (12 months) | 750 hrs/month B1S VM (12 months) |
| Storage | 5 GB S3 (12 months) | 5 GB Blob (12 months) |
| Database | 750 hrs RDS (12 months) | 250 GB Azure SQL (12 months) |
| Serverless | 1M Lambda requests/month (always free) | 1M Azure Functions requests/month (always free) |
| Kubernetes | None (EKS charges for control plane) | AKS control plane is always free |

### Cost Management Tools

| Feature | AWS | Azure |
|---------|-----|-------|
| Cost Dashboard | AWS Cost Explorer | Azure Cost Management |
| Budget Alerts | AWS Budgets | Azure Budgets |
| Recommendations | AWS Cost Anomaly Detection, Trusted Advisor | Azure Advisor |
| Calculator | AWS Pricing Calculator | Azure Pricing Calculator |
| TCO Analysis | AWS TCO Calculator | Azure TCO Calculator |
| Tagging Enforcement | AWS Tag Policies (via Organizations) | Azure Policy tag rules |

### Tips for Cost Optimization

- Use reserved instances or savings plans for steady-state workloads on both platforms.
- Leverage spot/low-priority VMs for fault-tolerant batch processing.
- Right-size instances using AWS Compute Optimizer or Azure Advisor.
- Use auto-scaling to match demand.
- Delete idle resources—both platforms charge for provisioned (not just consumed) resources.
- Use S3 Intelligent-Tiering or Azure Blob lifecycle management to auto-tier storage.

---

## 4. Certification Paths

### AWS Certifications

| Level | Certification | Code | Focus |
|-------|--------------|------|-------|
| Foundational | AWS Certified Cloud Practitioner | CLF-C02 | Cloud concepts, billing, high-level services |
| Associate | AWS Certified Solutions Architect – Associate | SAA-C03 | Designing resilient, performant architectures |
| Associate | AWS Certified Developer – Associate | DVA-C02 | Developing and maintaining AWS applications |
| Associate | AWS Certified SysOps Administrator – Associate | SOA-C02 | Deploying, managing, and operating AWS workloads |
| Professional | AWS Certified Solutions Architect – Professional | SAP-C02 | Complex, multi-account, enterprise architectures |
| Professional | AWS Certified DevOps Engineer – Professional | DOP-C02 | CI/CD, monitoring, automation, security on AWS |
| Specialty | Various (Security, Networking, Database, etc.) | — | Deep expertise in a specific domain |

### Azure Certifications

| Level | Certification | Code | Focus |
|-------|--------------|------|-------|
| Foundational | Azure Fundamentals | AZ-900 | Cloud concepts, core Azure services, pricing |
| Associate | Azure Administrator | AZ-104 | Managing subscriptions, identity, storage, compute |
| Associate | Azure Developer | AZ-204 | Building cloud solutions using Azure services |
| Expert | Azure Solutions Architect | AZ-305 | Designing infrastructure, identity, data, business continuity |
| Expert | DevOps Engineer Expert | AZ-400 | DevOps processes — CI/CD, monitoring, feedback (requires AZ-104 or AZ-204 as prereq) |
| Specialty | Azure Security Engineer | AZ-500 | Security controls, threat protection, identity management |

### Certification Comparison

| Aspect | AWS DevOps Pro (DOP-C02) | Azure DevOps Expert (AZ-400) |
|--------|------------------------|------------------------------|
| Prerequisites | Any AWS Associate cert | AZ-104 or AZ-204 |
| Focus | CI/CD, monitoring, logging, automation, IaC, security | CI/CD, source control, compliance, communication, release management |
| IaC Coverage | CloudFormation, CDK | ARM/Bicep, Terraform |
| Monitoring | CloudWatch, X-Ray | Azure Monitor, App Insights |
| Difficulty | High | High |

---

## 5. CLI Comparison

### Create a VM / Instance

**AWS CLI:**

```bash
# Launch an EC2 instance
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type t3.micro \
  --key-name my-key-pair \
  --security-group-ids sg-0123456789abcdef0 \
  --subnet-id subnet-0123456789abcdef0 \
  --count 1 \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=my-instance}]'
```

**Azure CLI:**

```bash
# Create a resource group (required in Azure)
az group create --name my-rg --location eastus

# Create a VM
az vm create \
  --resource-group my-rg \
  --name my-vm \
  --image Ubuntu2204 \
  --size Standard_B1s \
  --admin-username azureuser \
  --generate-ssh-keys
```

**Key Differences:**
- Azure requires a resource group for every resource.
- AWS uses AMI IDs for images; Azure uses publisher:offer:sku:version or URN aliases.
- Azure CLI can auto-generate SSH keys; AWS requires pre-created key pairs.

### Create a Storage Bucket / Container

**AWS CLI:**

```bash
# Create an S3 bucket
aws s3api create-bucket \
  --bucket my-unique-bucket-name \
  --region us-east-1

# Upload a file
aws s3 cp myfile.txt s3://my-unique-bucket-name/myfile.txt
```

**Azure CLI:**

```bash
# Create a storage account (globally unique name required)
az storage account create \
  --name mystorageacct123 \
  --resource-group my-rg \
  --location eastus \
  --sku Standard_LRS

# Create a blob container
az storage container create \
  --name my-container \
  --account-name mystorageacct123

# Upload a file
az storage blob upload \
  --account-name mystorageacct123 \
  --container-name my-container \
  --name myfile.txt \
  --file myfile.txt
```

**Key Differences:**
- AWS: bucket is a flat namespace under S3. Azure: storage account → container → blob (hierarchical).
- Azure requires a storage account before creating containers.
- S3 bucket names are globally unique; Azure storage account names are also globally unique.

### List Resources

**AWS CLI:**

```bash
# List EC2 instances
aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType]' --output table

# List S3 buckets
aws s3api list-buckets --query 'Buckets[*].Name' --output table

# List all resources (via Resource Groups Tagging API)
aws resourcegroupstaggingapi get-resources --output table
```

**Azure CLI:**

```bash
# List all VMs
az vm list --output table

# List all storage accounts
az storage account list --output table

# List ALL resources in a resource group
az resource list --resource-group my-rg --output table

# List ALL resources in a subscription
az resource list --output table
```

**Key Differences:**
- Azure's resource group model makes it easier to list all resources logically grouped together.
- AWS uses `--query` JMESPath for filtering; Azure uses `--query` JMESPath too but also supports `--output tsv/json/table/yaml`.
- Azure CLI has a more consistent verb-noun pattern (`az <service> <action>`).

---

## 6. Cheat Sheet — "If You Know AWS, the Azure Equivalent Is…"

| # | AWS Service | Azure Equivalent |
|---|-----------|-----------------|
| 1 | EC2 | Azure Virtual Machines |
| 2 | Lambda | Azure Functions |
| 3 | S3 | Azure Blob Storage |
| 4 | EBS | Azure Managed Disks |
| 5 | VPC | Virtual Network (VNet) |
| 6 | Route 53 | Azure DNS + Traffic Manager |
| 7 | CloudFront | Azure Front Door / Azure CDN |
| 8 | RDS | Azure SQL Database |
| 9 | DynamoDB | Azure Cosmos DB |
| 10 | EKS | AKS (Azure Kubernetes Service) |
| 11 | ECS Fargate | Azure Container Instances (ACI) |
| 12 | ECR | ACR (Azure Container Registry) |
| 13 | IAM | Entra ID + Azure RBAC |
| 14 | CloudWatch | Azure Monitor |
| 15 | CloudTrail | Azure Activity Log |
| 16 | CloudFormation | ARM Templates / Bicep |
| 17 | CodePipeline | Azure Pipelines |
| 18 | Secrets Manager | Azure Key Vault |
| 19 | SQS | Azure Queue Storage / Service Bus |
| 20 | SNS | Azure Event Grid / Notification Hubs |

---

## 7. Interview Questions & Answers

### Basic (Q1–Q15)

**Q1:** What is the primary difference between AWS and Azure in terms of market positioning?

> AWS was the first major cloud provider (launched 2006) and has the broadest service catalog. Azure (launched 2010) leverages Microsoft's enterprise presence, offering deep integration with Active Directory, Office 365, and .NET. AWS leads in startups and cloud-native; Azure leads in enterprise and hybrid scenarios.

**Q2:** What is the Azure equivalent of AWS EC2?

> Azure Virtual Machines. Both provide resizable compute capacity. Key difference: Azure offers the Hybrid Benefit for existing Windows Server / SQL Server license holders, reducing VM costs significantly.

**Q3:** What is the Azure equivalent of S3?

> Azure Blob Storage. Both are object storage services. S3 uses buckets; Azure uses storage accounts containing blob containers. S3 has more storage classes (Standard, IA, One Zone-IA, Glacier, Glacier Deep Archive, Intelligent-Tiering); Azure uses Hot, Cool, Cold, and Archive tiers.

**Q4:** How do IAM models differ between AWS and Azure?

> AWS IAM is per-account — you create users, groups, roles, and policies within each AWS account. Azure uses Entra ID (formerly Azure AD), a centralized enterprise directory with RBAC (Role-Based Access Control) assigned at different scopes: management group, subscription, resource group, or resource. Azure's identity model is inherently multi-tenant-capable.

**Q5:** What is the Azure equivalent of AWS Lambda?

> Azure Functions. Both are event-driven serverless compute. Key differences: Lambda max timeout is 15 minutes; Azure Functions Consumption plan has a 10-minute default (configurable to 60 min on Premium). Azure also supports Durable Functions for stateful orchestrations.

**Q6:** Compare EKS and AKS.

> EKS (Elastic Kubernetes Service) and AKS (Azure Kubernetes Service) are managed Kubernetes offerings. AKS control plane is free; EKS charges ~$0.10/hr per cluster. AKS integrates with Entra ID for RBAC. Both support autoscaling, node pools, and the CNI networking model.

**Q7:** What is the Azure equivalent of CloudFormation?

> ARM (Azure Resource Manager) Templates and Bicep. CloudFormation uses JSON/YAML to define AWS resources. ARM templates are JSON-based; Bicep is a DSL that compiles to ARM JSON and provides a cleaner authoring experience. Both also have Terraform as a cross-platform alternative.

**Q8:** How do free tiers compare between AWS and Azure?

> Both offer 12 months of free services plus always-free tiers. AWS gives 750 hrs/month t2.micro EC2 and 5 GB S3. Azure gives 750 hrs/month B1S VM and 5 GB Blob. A notable difference: AKS control plane is always free on Azure, while EKS always charges for the control plane.

**Q9:** What is the Azure equivalent of AWS VPC?

> Azure Virtual Network (VNet). Both provide isolated network environments. Key differences: VPCs use Internet Gateways and NAT Gateways explicitly; VNets provide default outbound Internet access. Azure uses Network Security Groups (NSGs) at subnet and NIC level; AWS uses Security Groups and NACLs.

**Q10:** What is the equivalent of AWS CloudWatch in Azure?

> Azure Monitor. CloudWatch collects metrics, logs, and alarms. Azure Monitor encompasses Metrics, Log Analytics (with KQL), Alerts, and integrates with Application Insights for APM. Both support custom metrics and dashboard creation.

**Q11:** Compare AWS Secrets Manager and Azure Key Vault.

> AWS Secrets Manager is a dedicated service for rotating and managing secrets. Azure Key Vault combines key management, secret management, and certificate management in a single service. Key Vault is closer to a combination of AWS KMS + Secrets Manager + ACM.

**Q12:** What is the Azure equivalent of Route 53?

> Azure DNS for hosting DNS zones, and Azure Traffic Manager for DNS-based traffic routing (equivalent to Route 53 routing policies). Route 53 can also register domains; Azure DNS cannot.

**Q13:** What is an Azure Resource Group, and does AWS have an equivalent?

> An Azure Resource Group is a mandatory logical container for Azure resources, enabling unified management, RBAC, and lifecycle control. AWS has Resource Groups too, but they're optional and primarily for tagging and viewing — they don't enforce lifecycle or access boundaries like Azure's.

**Q14:** How do you choose between AWS and Azure for a new project?

> Consider: (1) Existing ecosystem — Microsoft shops benefit from Azure's Entra ID and O365 integration; (2) Team expertise; (3) Specific services needed — e.g., Cosmos DB's multi-model capability or DynamoDB's single-digit-ms latency; (4) Pricing for your workload pattern; (5) Compliance and regional availability; (6) Hybrid needs — Azure Arc vs AWS Outposts.

**Q15:** What is the equivalent of Elastic Beanstalk in Azure?

> Azure App Service. Both are PaaS platforms for deploying web applications without managing infrastructure. App Service supports deployment slots, built-in authentication, custom domains, and auto-scaling. Elastic Beanstalk is thinner, essentially orchestrating EC2, ALB, and Auto Scaling Groups for you.

---

### Intermediate (Q16–Q35)

**Q16:** Compare AWS CodePipeline and Azure Pipelines for CI/CD.

> AWS CodePipeline is a managed CI/CD orchestrator that integrates with CodeBuild (build) and CodeDeploy (deploy) as separate services. Azure Pipelines is a single unified service supporting multi-stage YAML pipelines with build, test, and deploy in one pipeline definition. Azure Pipelines supports more SCM integrations out of the box (GitHub, Bitbucket, Azure Repos) and offers free parallel jobs for open-source projects.

**Q17:** How does networking differ between AWS VPC and Azure VNet?

> VPC: requires explicit Internet Gateway for public internet access, NAT Gateway for private subnet outbound access, and separate route tables. VNet: provides default outbound internet access (though Azure is moving toward explicit NAT Gateway requirements), uses NSGs for traffic filtering, and supports service endpoints and private endpoints natively. Both support peering and VPN gateways.

**Q18:** Compare DynamoDB and Cosmos DB in depth.

> DynamoDB is a key-value and document store with single-digit-millisecond performance, automatic scaling, and DynamoDB Streams for CDC. Cosmos DB is a multi-model database supporting document, key-value, graph (Gremlin), column-family (Cassandra API), and table APIs. Cosmos DB offers five configurable consistency levels (Strong, Bounded Staleness, Session, Consistent Prefix, Eventual) and turnkey global distribution. DynamoDB offers eventual and strong consistency only.

**Q19:** What are the differences between AWS Organizations and Azure Management Groups?

> AWS Organizations manages multiple AWS accounts with Service Control Policies (SCPs) that set permission guardrails. Azure Management Groups create a hierarchy above subscriptions for organizing and applying Azure Policies and RBAC. The hierarchy is: Tenant Root Group → Management Groups → Subscriptions → Resource Groups → Resources. Both enable centralized governance and billing.

**Q20:** Compare Direct Connect and ExpressRoute.

> Both provide dedicated private connections to the cloud. Direct Connect connects to AWS via partner colocation facilities with 1 Gbps or 10 Gbps links. ExpressRoute supports similar dedicated connections but adds Microsoft Peering (for Microsoft 365 and Dynamics 365 traffic) alongside Private Peering. ExpressRoute also supports ExpressRoute Global Reach for site-to-site connectivity through Microsoft's backbone.

**Q21:** How do container registries compare (ECR vs ACR)?

> ECR (Elastic Container Registry) is AWS's managed Docker registry, tightly integrated with ECS and EKS. ACR (Azure Container Registry) supports Docker images, Helm charts, and OCI artifacts. ACR offers ACR Tasks for automated image building and patching in the cloud. Both support image scanning and geo-replication (ACR Premium / ECR cross-region replication).

**Q22:** Compare AWS WAF and Azure WAF.

> Both provide web application firewall capabilities with managed rule sets (OWASP, bot protection). AWS WAF attaches to CloudFront, ALB, or API Gateway. Azure WAF integrates with Application Gateway, Front Door, and Azure CDN. Azure WAF on Front Door provides global protection across edge locations. Both support custom rules and rate limiting.

**Q23:** How does IaC differ: CloudFormation vs ARM/Bicep vs Terraform?

> CloudFormation: AWS-native, JSON/YAML, supports drift detection, change sets, and stack sets for multi-account deployments. ARM Templates: Azure-native, JSON-based, verbose. Bicep: Azure-native DSL that compiles to ARM JSON, much cleaner syntax. Terraform: multi-cloud, uses HCL, supports state management, and works with both AWS and Azure (plus 1000+ other providers). For multi-cloud shops, Terraform is the standard.

**Q24:** Compare serverless workflows: Step Functions vs Logic Apps vs Durable Functions.

> AWS Step Functions: define workflows using Amazon States Language (JSON), supports standard and express workflows, deeply integrated with AWS services. Azure Logic Apps: low-code/no-code visual designer with 400+ connectors (SaaS, on-prem), ideal for integration scenarios. Azure Durable Functions: code-first orchestration using C#, JavaScript, Python, or Java, extending Azure Functions for stateful workflows. Step Functions is closest to Durable Functions in approach; Logic Apps is more like a BPM tool.

**Q25:** Explain the differences between AWS Spot Instances and Azure Spot VMs.

> Both offer spare compute capacity at up to 90% discount. AWS Spot Instances can be interrupted with a 2-minute warning when AWS needs the capacity back. Azure Spot VMs can be evicted based on capacity or max-price policy. AWS provides Spot Fleet for managing groups of Spot Instances. Azure supports Spot VMs with scale sets. Both are ideal for stateless, fault-tolerant workloads like batch processing, CI/CD runners, and data analysis.

**Q26:** How does monitoring differ between CloudWatch and Azure Monitor?

> CloudWatch: collects metrics (standard and custom), logs (CloudWatch Logs), alarms, dashboards, and provides Logs Insights for querying. Azure Monitor: collects metrics, logs into Log Analytics workspaces (queried with KQL — Kusto Query Language), alerts, workbooks, and integrates with Application Insights for APM. Azure Monitor's KQL is more powerful than CloudWatch Logs Insights for complex queries. Both support auto-scaling triggers based on metrics.

**Q27:** Compare API Gateway (AWS) and Azure API Management (APIM).

> AWS API Gateway: supports REST, HTTP, and WebSocket APIs; integrates with Lambda for serverless backends; relatively lightweight. Azure APIM: full-featured API management platform with developer portal, API versioning, subscriptions/keys, rate limiting, caching, transformation policies, and monetization. APIM is more suited for enterprise API programs; API Gateway is simpler for Lambda-backed APIs.

**Q28:** How do you approach migrating from AWS to Azure?

> (1) Assess: inventory all AWS resources, dependencies, and data flows. (2) Map: identify Azure equivalents for each service (refer to the comparison table). (3) Plan: decide migration strategy per workload — rehost (lift-and-shift), replatform, or refactor. (4) Execute: use tools like Azure Migrate for VMs, Azure Database Migration Service for databases, and AzCopy for storage. (5) Optimize: leverage Azure Advisor and Cost Management post-migration. (6) Test thoroughly — especially IAM, networking, and DNS configurations.

**Q29:** Compare AWS GuardDuty and Microsoft Defender for Cloud.

> GuardDuty is an AWS threat detection service analyzing CloudTrail, VPC Flow Logs, and DNS logs for suspicious activity. Defender for Cloud is broader — it provides security posture management (CSPM), threat protection for Azure, AWS, and GCP resources, vulnerability assessment, and regulatory compliance dashboards. Defender can monitor multi-cloud environments; GuardDuty is AWS-only.

**Q30:** What is Azure Arc, and how does it compare to AWS Outposts?

> Azure Arc extends Azure management to any infrastructure — on-prem servers, Kubernetes clusters, databases, and even other clouds. It uses agents and Azure Resource Manager for unified governance. AWS Outposts physically deploys AWS hardware into your datacenter. Key difference: Arc is software-based and manages existing infrastructure; Outposts is AWS-branded hardware running in your facility.

**Q31:** Compare Aurora and Azure SQL Hyperscale.

> Aurora: managed relational database compatible with MySQL and PostgreSQL, up to 5x throughput of MySQL, auto-scales storage up to 128 TB, supports up to 15 read replicas and Aurora Global Database. Azure SQL Hyperscale: based on SQL Server engine, supports up to 100 TB, rapid scale-out read replicas, instant database snapshots, and fast backups regardless of database size. Aurora is multi-engine; Hyperscale is SQL Server-only.

**Q32:** How do cost management tools compare between the platforms?

> AWS: Cost Explorer for visualization, Budgets for alerts, Cost Anomaly Detection for AI-driven anomaly alerts, and Trusted Advisor for cost optimization recommendations. Azure: Cost Management + Billing for visualization and budgets, Azure Advisor for optimization recommendations, and Power BI integration for advanced reporting. Both support tagging for cost allocation. Azure Cost Management can also track AWS costs (cross-cloud).

**Q33:** Compare SQS and Azure Service Bus.

> SQS: highly scalable message queue, supports Standard (at-least-once, best-effort ordering) and FIFO (exactly-once, strict ordering) queues. Azure Service Bus: enterprise message broker supporting queues, topics/subscriptions (pub/sub), sessions, transactions, dead-letter queues, scheduled delivery, and duplicate detection. Service Bus is richer in features; SQS is simpler and more scalable. For simple decoupling, SQS suffices; for complex messaging patterns, Service Bus is better.

**Q34:** How do container orchestration services (ECS vs ACI) differ from Kubernetes (EKS vs AKS)?

> ECS is AWS's proprietary orchestrator with deep AWS integration. ACI runs individual container groups without cluster management. Both EKS and AKS are managed Kubernetes — portable and open-source. Use ECS/ACI for simple containerized workloads; use EKS/AKS for complex microservices that benefit from the Kubernetes ecosystem (Helm, service mesh, GitOps operators). ECS uses Task Definitions; Kubernetes uses Pods, Deployments, and Services.

**Q35:** Compare SNS/EventBridge with Azure Event Grid.

> SNS: simple pub/sub for notifications (email, SMS, HTTP, SQS, Lambda). EventBridge: event bus with schema registry, content-based filtering, and SaaS partner integrations. Azure Event Grid: event-driven reactive programming service with topic/subscription model, advanced filtering, and dead-lettering. EventBridge and Event Grid are conceptually closest — both enable event-driven architectures. SNS is simpler and better for fan-out notification patterns.

---

### Advanced (Q36–Q50)

**Q36:** You are designing a multi-cloud architecture using both AWS and Azure. How do you handle identity and access management across both clouds?

> Use a federated identity model. Establish Entra ID (Azure AD) as the identity provider and configure AWS IAM Identity Center (formerly AWS SSO) to federate with Entra ID via SAML 2.0 or OIDC. This gives users a single identity to access both clouds. For service-to-service authentication, use workload identity federation — AWS roles can trust Azure managed identities via OIDC federation, eliminating shared secrets. Terraform or Pulumi can manage IAM resources across both clouds from a single codebase.

**Q37:** How would you design a disaster recovery strategy spanning AWS and Azure?

> (1) Define RTO/RPO for each workload. (2) Use active-passive or active-active patterns depending on criticality. (3) Replicate databases using cross-cloud replication (e.g., PostgreSQL logical replication between RDS and Azure Database for PostgreSQL). (4) Use DNS-based failover (Route 53 or Traffic Manager) to route traffic to the healthy cloud. (5) Store IaC for both clouds in version control for rapid reprovisioning. (6) Replicate object storage using cross-cloud sync tools. (7) Test failover regularly. (8) Use Kubernetes federation or GitOps to maintain consistent application deployments.

**Q38:** Compare the networking models in depth: how does traffic flow differently in AWS vs Azure?

> AWS VPC: Explicit architecture — you configure Internet Gateways, NAT Gateways, route tables, Security Groups (stateful), and NACLs (stateless). Subnets are public or private based on route table entries. Azure VNet: Historically defaulted to outbound internet — Azure is now requiring explicit NAT Gateway for outbound. NSGs control both inbound and outbound (stateful, applied at subnet or NIC level). Azure uses User Defined Routes (UDRs) similar to AWS custom route tables. Both support PrivateLink/Private Endpoints for private access to PaaS services. Azure's VNet has native integration with service endpoints for PaaS services.

**Q39:** How would you implement GitOps on both EKS and AKS?

> Use Flux CD or Argo CD — both are CNCF projects that work identically on EKS and AKS. (1) Store Kubernetes manifests and Helm charts in Git. (2) Install Flux/Argo CD operator on each cluster. (3) Configure the operator to watch the Git repo and automatically reconcile cluster state. AKS has native Flux v2 integration via Azure Arc GitOps extension. EKS can use Flux or Argo CD installed via Helm. Both approaches ensure declarative, auditable, and consistent deployments across clouds.

**Q40:** An organization wants to enforce governance across 200+ AWS accounts and 50+ Azure subscriptions. What tools and strategies do you recommend?

> AWS: Use AWS Organizations with SCPs to set guardrails, AWS Control Tower for automated landing zone setup, and AWS Config for compliance rules. Azure: Use Management Groups with Azure Policy (built-in and custom policies), Azure Blueprints (deprecated — use Template Specs) for repeatable environment deployment, and Microsoft Defender for Cloud for compliance dashboards. Cross-cloud: Use Terraform Cloud/Enterprise with Sentinel policies or Open Policy Agent (OPA) for unified policy-as-code across both clouds. Implement tagging standards enforced via AWS Tag Policies and Azure Policy for cost allocation and ownership.

**Q41:** Compare the serverless cold start behavior and mitigation strategies on AWS Lambda vs Azure Functions.

> Lambda cold starts depend on runtime (Java/C# are worst, Python/Node.js are better), memory allocation, and VPC configuration (VPC cold starts were significantly reduced with Hyperplane ENI in 2019). Mitigation: use Provisioned Concurrency to keep warm instances, or use SnapStart (Java). Azure Functions cold starts on the Consumption plan are similar. Mitigation: use the Premium plan with pre-warmed instances or the Dedicated (App Service) plan for always-on. Azure also supports KEDA-based autoscaling. Both benefit from smaller deployment packages and minimal initialization code.

**Q42:** How do you design a zero-trust network architecture on each platform?

> AWS: Use VPC with no public subnets. All access via AWS PrivateLink, VPN, or Direct Connect. Use Security Groups with least-privilege rules. Enable VPC Flow Logs. Use IAM Roles Anywhere for on-prem identity. Enforce MFA via IAM policies. Azure: Use VNet with NSGs denying all inbound by default. Use Private Endpoints for PaaS services. Use Azure Firewall or third-party NVAs for east-west inspection. Enable Conditional Access policies in Entra ID. Use Microsoft Entra Verified ID for identity verification. Both: implement micro-segmentation, encrypt all traffic in transit (TLS 1.2+), and use SIEM (AWS Security Hub / Microsoft Sentinel) for threat detection.

**Q43:** Compare infrastructure automation testing approaches on both platforms.

> AWS: Use cfn-lint and cfn-nag for CloudFormation static analysis, Taskcat for multi-region deployment testing, and LocalStack for local AWS service emulation. Azure: Use Bicep linter, PSRule for Azure (policy-aware testing), and Azure Deployment What-If for previewing changes. Cross-cloud: Terraform has `terraform validate`, `terraform plan`, checkov/tfsec for security scanning, and Terratest for integration testing in Go. Use OPA/Conftest for policy-as-code validation of IaC artifacts regardless of provider.

**Q44:** Your team is running Kubernetes on both EKS and AKS. How do you standardize operations?

> (1) Use identical CI/CD pipelines producing the same container images and Helm charts. (2) Use GitOps (Flux/Argo CD) on both clusters for deployment consistency. (3) Standardize observability: Prometheus + Grafana for metrics, OpenTelemetry for distributed tracing, Loki or Elasticsearch for logs — these are cloud-agnostic. (4) Use external-dns controller for both clusters to register services with Route 53/Azure DNS. (5) Use cert-manager for TLS certificates. (6) Use OPA Gatekeeper for policy enforcement on both clusters. (7) Manage cluster provisioning with Terraform.

**Q45:** An application needs to process 10 million events per day. Compare the architectural approaches on AWS vs Azure.

> AWS: Use Kinesis Data Streams or MSK (Managed Kafka) for ingestion → Lambda or ECS for processing → DynamoDB or S3 for storage → Athena/Redshift for analytics. Azure: Use Event Hubs (Kafka-compatible) for ingestion → Azure Functions or Container Apps for processing → Cosmos DB or Blob Storage for storage → Synapse Analytics for analytics. Key differences: Event Hubs supports AMQP and Kafka protocols natively; Kinesis is proprietary. Cosmos DB's multi-model and global distribution may simplify the data layer. For exactly-once processing, use SQS FIFO or Service Bus sessions.

**Q46:** How do you implement compliant logging and auditing across both clouds?

> AWS: Enable CloudTrail in all regions (with org-wide trail), VPC Flow Logs, S3 access logging, and centralize into a security account's S3 bucket. Use AWS Config for resource configuration history. Enable GuardDuty and Security Hub. Azure: Enable Activity Log (automatic), Diagnostic Settings for all resources piped to a central Log Analytics workspace, NSG Flow Logs, and Azure Policy for enforcing diagnostic settings. Use Defender for Cloud for compliance dashboards. Cross-cloud: Use a SIEM like Microsoft Sentinel (which natively ingests AWS data) or Splunk for unified audit trail. Ensure immutability via S3 Object Lock or Azure Blob immutability policies.

**Q47:** Compare the hybrid cloud approaches: AWS Outposts, Azure Stack Hub, Azure Stack HCI, and Azure Arc.

> AWS Outposts: AWS-managed hardware (compute + storage racks) deployed in your datacenter running native AWS services (EC2, EBS, RDS, ECS, EKS). Full Outpost racks or smaller 1U/2U servers. Azure Stack Hub: disconnected or connected deployment of Azure services (VMs, App Service, etc.) in your datacenter — full Azure stack. Azure Stack HCI: hyper-converged infrastructure running on validated hardware with Azure integration for VM management and AKS. Azure Arc: software-only — projects Azure Resource Manager onto any Kubernetes cluster or server anywhere (on-prem or other clouds), enabling Azure Policy, GitOps, and monitoring without special hardware. Arc is the most flexible; Outposts requires AWS hardware.

**Q48:** Design a cost-optimized CI/CD infrastructure using both cloud providers.

> Use GitHub Actions or GitLab CI as the centralized CI/CD platform (cloud-agnostic). For AWS deployments: use self-hosted runners on EC2 Spot Instances or CodeBuild with on-demand scaling. For Azure deployments: use Azure DevOps self-hosted agents on Spot VMs or Azure Pipelines Microsoft-hosted agents (includes free tier for open source). Build container images once, push to both ECR and ACR using CI/CD. Use Terraform for infrastructure provisioning on both clouds. Cache dependencies aggressively. Use ARM/Graviton-based runners for 20-40% cost savings on AWS.

**Q49:** How would you handle data residency and sovereignty requirements across AWS and Azure?

> (1) Identify regulated data and applicable regulations (GDPR, CCPA, HIPAA, etc.). (2) Map regulations to eligible regions — both AWS and Azure publish compliance certifications per region. (3) Enforce region restrictions: AWS SCPs can deny resource creation outside approved regions; Azure Policy can restrict deployments to specific locations. (4) Encrypt data at rest (KMS/Key Vault with customer-managed keys stored in the same region) and in transit. (5) Use AWS Sovereign Cloud / Azure Sovereign Clouds (Azure Government, Azure China) for highly regulated workloads. (6) Audit with Config Rules / Azure Policy compliance reports.

**Q50:** Your company is evaluating total cost of ownership for running a microservices platform on EKS vs AKS. What factors would you analyze?

> (1) Control plane cost: AKS is free; EKS is ~$73/month per cluster. (2) Node costs: compare equivalent VM pricing (consider reserved/savings plans and spot). Azure Hybrid Benefit can reduce Windows node costs. (3) Networking: compare data transfer costs — Azure charges for inter-AZ and egress; AWS charges similarly but rates differ. (4) Storage: compare EBS vs Azure Disk pricing for persistent volumes. (5) Load balancing: ALB/NLB vs Azure Load Balancer/Application Gateway. (6) Monitoring: CloudWatch vs Azure Monitor — both have free tiers and paid tiers. (7) Container registry: ECR vs ACR. (8) Operational overhead: team familiarity, training costs, and certification paths. (9) Support plans: compare Business/Enterprise support pricing. (10) Use the respective TCO calculators, then validate with a proof-of-concept running actual workloads for 30 days on both platforms.

---

*Last updated: April 2026*
