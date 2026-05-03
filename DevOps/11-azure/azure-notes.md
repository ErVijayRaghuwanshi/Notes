---
title: Azure Notes
layout: default
render_with_liquid: false
---
# Microsoft Azure — DevOps Interview Preparation Notes

---

## 1. Introduction

### What is Azure?

Microsoft Azure is a cloud computing platform offering 200+ services including compute, storage, networking, AI, IoT, and DevOps tools. It supports IaaS, PaaS, SaaS, and serverless models.

### Global Infrastructure

- **Regions**: 60+ geographic regions worldwide (e.g., East US, West Europe, Southeast Asia). Each region contains one or more datacenters.
- **Availability Zones**: Physically separate locations within a region (minimum 3 zones per enabled region). Each zone has independent power, cooling, and networking.
- **Region Pairs**: Each Azure region is paired with another region within the same geography (e.g., East US ↔ West US). Provides disaster recovery — Azure prioritizes recovery of one region per pair during outages.

### Azure Resource Manager (ARM)

ARM is the deployment and management layer for Azure. All requests (Portal, CLI, SDK, REST API) go through ARM.

- **Resource**: A manageable item (VM, storage account, web app).
- **Resource Group**: A logical container for resources sharing the same lifecycle.
- **Subscription**: A billing boundary and access-control boundary.
- **Management Group**: A container for managing access, policy, and compliance across multiple subscriptions.

```
Management Group
  └── Subscription
        └── Resource Group
              └── Resource
```

### Shared Responsibility Model

| Responsibility        | IaaS        | PaaS        | SaaS        |
|-----------------------|-------------|-------------|-------------|
| Data & Access         | Customer    | Customer    | Customer    |
| Applications          | Customer    | Customer    | Provider    |
| Runtime / Middleware   | Customer    | Provider    | Provider    |
| OS                    | Customer    | Provider    | Provider    |
| Physical Host / Network | Provider | Provider    | Provider    |

---

## 2. Core Services

### 2.1 Compute

#### Azure Virtual Machines

Scalable on-demand compute. Supports Linux and Windows.

**Key Features**: Multiple VM sizes (General Purpose, Compute Optimized, Memory Optimized, Storage Optimized, GPU), custom images, Availability Sets, Scale Sets.

- **Availability Sets**: Distribute VMs across fault domains (hardware racks) and update domains (reboot groups).
- **Virtual Machine Scale Sets (VMSS)**: Automatically create and manage a group of identical, load-balanced VMs. Supports autoscaling.

**Common VM Sizes:**

| Series | Type              | Use Case                    |
|--------|-------------------|-----------------------------|
| B      | Burstable         | Dev/test, low-traffic web   |
| D      | General Purpose   | Enterprise apps, databases  |
| E      | Memory Optimized  | In-memory analytics, caches |
| F      | Compute Optimized | Batch processing, gaming    |
| N      | GPU               | ML training, rendering      |

```bash
# Create a VM
az vm create \
  --resource-group myRG \
  --name myVM \
  --image Ubuntu2204 \
  --size Standard_B2s \
  --admin-username azureuser \
  --generate-ssh-keys
```

#### Azure Functions

Serverless event-driven compute. Pay only for execution time.

**Key Features**: Triggers (HTTP, Timer, Blob, Queue, Event Hub), bindings (input/output), Durable Functions for workflows, supports C#, Python, JavaScript, Java, PowerShell.

**Hosting Plans**: Consumption (auto-scale, pay-per-execution), Premium (pre-warmed, VNet integration), Dedicated (App Service Plan).

```bash
# Create a Function App
az functionapp create \
  --resource-group myRG \
  --consumption-plan-location eastus \
  --runtime python \
  --runtime-version 3.11 \
  --functions-version 4 \
  --name myFuncApp \
  --storage-account mystorageacct
```

#### Azure App Service

Fully managed PaaS for hosting web apps, REST APIs, and mobile backends.

**Key Features**: Built-in CI/CD, custom domains, SSL, autoscaling, deployment slots (staging/production swap), support for .NET, Java, Node.js, Python, PHP.

```bash
# Create and deploy a web app
az webapp create \
  --resource-group myRG \
  --plan myAppServicePlan \
  --name myWebApp \
  --runtime "PYTHON:3.11"
```

#### Azure Container Instances (ACI)

Run containers without managing VMs or orchestrators. Fastest way to run a container in Azure.

**Key Features**: Per-second billing, custom sizes (CPU/memory), supports Linux and Windows, container groups (like pods), VNet integration.

```bash
az container create \
  --resource-group myRG \
  --name mycontainer \
  --image mcr.microsoft.com/azuredocs/aci-helloworld \
  --ports 80 \
  --dns-name-label myapp-demo
```

#### Azure Kubernetes Service (AKS)

Managed Kubernetes orchestration. Azure manages the control plane; you manage worker nodes.

**Key Features**: Integrated CI/CD, Azure Monitor for containers, Azure CNI or kubenet networking, auto-scaling (cluster autoscaler + HPA), Azure AD integration, node pools (system + user).

```bash
# Create an AKS cluster
az aks create \
  --resource-group myRG \
  --name myAKSCluster \
  --node-count 3 \
  --node-vm-size Standard_DS2_v2 \
  --enable-managed-identity \
  --generate-ssh-keys

# Get credentials
az aks get-credentials --resource-group myRG --name myAKSCluster
```

---

### 2.2 Storage

#### Azure Blob Storage

Object storage for unstructured data (images, videos, logs, backups).

**Key Concepts:**
- **Storage Account** → **Containers** → **Blobs**
- Blob types: Block blobs, Append blobs, Page blobs

**Access Tiers:**

| Tier    | Use Case                    | Access Cost | Storage Cost |
|---------|-----------------------------|-------------|--------------|
| Hot     | Frequently accessed data    | Lowest      | Highest      |
| Cool    | Infrequently accessed (30+ days) | Medium | Medium       |
| Archive | Rarely accessed (180+ days) | Highest     | Lowest       |

```bash
# Create a storage account
az storage account create \
  --name mystorageacct \
  --resource-group myRG \
  --location eastus \
  --sku Standard_LRS

# Upload a blob
az storage blob upload \
  --account-name mystorageacct \
  --container-name mycontainer \
  --name myfile.txt \
  --file ./myfile.txt
```

#### Azure Files

Fully managed file shares accessible via SMB and NFS protocols. Can be mounted by cloud or on-prem machines.

**Use Case**: Lift-and-shift applications, shared config files, dev/test environments.

#### Azure Disk Storage

High-performance block storage for Azure VMs. Types: Ultra Disk, Premium SSD, Standard SSD, Standard HDD.

#### Storage Account Replication

| Replication      | Description                              |
|------------------|------------------------------------------|
| LRS              | 3 copies in one datacenter               |
| ZRS              | 3 copies across availability zones       |
| GRS              | LRS + async copy to paired region        |
| RA-GRS           | GRS + read access to secondary region    |

---

### 2.3 Networking

#### Virtual Network (VNet)

Private network in Azure. Foundation for all networking.

**Key Concepts:**
- **Subnets**: Segment a VNet into multiple address ranges.
- **Network Security Groups (NSGs)**: Stateful firewall rules (allow/deny) applied to subnets or NICs. Rules based on source/destination IP, port, and protocol.
- **Application Security Groups (ASGs)**: Group VMs logically and apply NSG rules to the group instead of individual IPs.

```bash
# Create a VNet with subnet
az network vnet create \
  --resource-group myRG \
  --name myVNet \
  --address-prefix 10.0.0.0/16 \
  --subnet-name mySubnet \
  --subnet-prefix 10.0.1.0/24

# Create an NSG and rule
az network nsg create --resource-group myRG --name myNSG

az network nsg rule create \
  --resource-group myRG \
  --nsg-name myNSG \
  --name AllowHTTP \
  --priority 100 \
  --direction Inbound \
  --access Allow \
  --protocol Tcp \
  --destination-port-ranges 80 443
```

#### Azure DNS

Host DNS zones and manage DNS records in Azure. Supports private DNS zones for VNet name resolution.

#### Application Gateway

Layer 7 (HTTP/HTTPS) load balancer with:
- URL-based routing
- SSL termination
- Web Application Firewall (WAF)
- Cookie-based session affinity
- Autoscaling (v2)

#### Azure Load Balancer

Layer 4 (TCP/UDP) load balancer. Options: Public (internet-facing) or Internal (private).

| Feature             | Load Balancer (L4)  | Application Gateway (L7) |
|---------------------|---------------------|--------------------------|
| OSI Layer           | Transport (4)       | Application (7)          |
| Protocol            | TCP/UDP             | HTTP/HTTPS               |
| URL-based Routing   | No                  | Yes                      |
| SSL Offloading      | No                  | Yes                      |
| WAF                 | No                  | Yes                      |

#### VNet Peering

Connect two VNets so resources communicate using private IP addresses. Works across regions (global peering). Non-transitive by default.

#### Azure Firewall

Managed, cloud-based network security service. Centralized, stateful firewall with built-in high availability.

**Key Features**: Application rules (FQDN filtering), network rules (IP-based), threat intelligence, DNAT support, logging to Azure Monitor.

#### ExpressRoute

Private, dedicated connection between on-premises network and Azure (does not traverse the public internet). Bandwidth up to 100 Gbps. Use for: high-throughput, low-latency, regulatory compliance.

#### VPN Gateway

Connects on-premises networks to Azure over an encrypted tunnel (IPsec/IKE) via the public internet. Types: Site-to-Site, Point-to-Site, VNet-to-VNet.

---

### 2.4 Database

#### Azure SQL Database

Fully managed relational database (SQL Server engine). Supports elastic pools, serverless compute tier, auto-tuning, geo-replication, built-in threat detection.

#### Azure Cosmos DB

Globally distributed, multi-model NoSQL database. Supports SQL, MongoDB, Cassandra, Gremlin, Table APIs. Offers single-digit millisecond latency and 99.999% availability SLA with multi-region writes.

#### Azure Database for MySQL / PostgreSQL

Fully managed open-source relational databases. Options: Single Server, Flexible Server (recommended). Built-in HA, automated backups, VNet integration.

#### Azure Cache for Redis

In-memory data store based on Redis. Use cases: caching, session store, real-time analytics, message broker. Tiers: Basic, Standard, Premium, Enterprise.

---

### 2.5 Security & Identity

#### Microsoft Entra ID (formerly Azure AD)

Cloud-based identity and access management service.

**Key Concepts:**
- **Users**: Individual identities (cloud-only or synced from on-prem AD DS).
- **Groups**: Security groups and Microsoft 365 groups for access management.
- **Service Principals**: Identity for applications/services to access Azure resources.
- **Managed Identities**: Azure-managed identity for services — eliminates credential management.
  - **System-assigned**: Tied to an Azure resource lifecycle.
  - **User-assigned**: Standalone resource; can be shared across services.

#### Role-Based Access Control (RBAC)

Controls who has access to Azure resources and what they can do.

**Components**: Security Principal + Role Definition + Scope = Role Assignment

**Built-in Roles:**

| Role                  | Permissions                                      |
|-----------------------|--------------------------------------------------|
| Owner                 | Full access + can assign roles                   |
| Contributor           | Full access, cannot assign roles                 |
| Reader                | View resources only                              |
| User Access Admin     | Manage user access to resources                  |

**Scope Hierarchy**: Management Group → Subscription → Resource Group → Resource

```bash
# Assign Contributor role to a user
az role assignment create \
  --assignee user@example.com \
  --role "Contributor" \
  --scope /subscriptions/<sub-id>/resourceGroups/myRG
```

#### Conditional Access

Policy engine in Entra ID. Evaluates signals (user, location, device, app, risk) to enforce access controls (allow, block, require MFA).

#### Azure Key Vault

Centralized secrets management. Stores and controls access to secrets, encryption keys, and certificates. Integrated with Managed Identities for secure, credential-free access.

```bash
# Create a Key Vault and add a secret
az keyvault create --name myKeyVault --resource-group myRG --location eastus

az keyvault secret set --vault-name myKeyVault --name "dbPassword" --value "S3cur3P@ss!"
```

#### Microsoft Defender for Cloud

Unified security management and threat protection. Provides security posture management (Secure Score), vulnerability assessment, and threat detection across Azure, hybrid, and multi-cloud.

---

### 2.6 Monitoring

#### Azure Monitor

Platform-wide monitoring solution.

- **Metrics**: Numeric time-series data (CPU %, memory, request count). Near real-time.
- **Logs**: Structured and unstructured logs collected into Log Analytics workspace. Queried with Kusto Query Language (KQL).
- **Alerts**: Trigger notifications or automated actions based on metric/log conditions.

```kql
// KQL: Find top 5 most expensive requests
requests
| where timestamp > ago(1h)
| top 5 by duration desc
| project name, duration, resultCode
```

#### Log Analytics

Workspace for ingesting and querying log data using KQL. Central repository for Azure Monitor Logs, Defender for Cloud, Sentinel.

#### Application Insights

APM (Application Performance Monitoring) service. Auto-detects performance anomalies. Features: request tracking, dependency mapping, live metrics, failure analysis, availability tests.

#### Azure Advisor

Free recommendation engine for cost optimization, security, reliability, operational excellence, and performance. Provides actionable suggestions based on your resource configurations.

---

### 2.7 DevOps

#### Azure DevOps Services

End-to-end DevOps toolchain:

| Service          | Purpose                                         |
|------------------|--------------------------------------------------|
| Azure Repos      | Git repositories (private, unlimited)            |
| Azure Pipelines  | CI/CD pipelines (YAML or Classic)                |
| Azure Boards     | Work tracking (Agile, Scrum, Kanban)             |
| Azure Artifacts  | Package management (NuGet, npm, Maven, PyPI)     |
| Azure Test Plans | Manual and exploratory testing                   |

**Sample YAML Pipeline:**

```yaml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: 'ubuntu-latest'

stages:
  - stage: Build
    jobs:
      - job: BuildJob
        steps:
          - task: UsePythonVersion@0
            inputs:
              versionSpec: '3.11'
          - script: |
              pip install -r requirements.txt
              python -m pytest tests/ --junitxml=results.xml
            displayName: 'Install & Test'
          - task: PublishTestResults@2
            inputs:
              testResultsFiles: 'results.xml'

  - stage: Deploy
    dependsOn: Build
    jobs:
      - deployment: DeployWeb
        environment: 'production'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: 'my-svc-connection'
                    appName: 'myWebApp'
                    package: '$(Pipeline.Workspace)/**/*.zip'
```

#### Azure Container Registry (ACR)

Private Docker registry in Azure. Supports Docker images, OCI artifacts, Helm charts. Tiers: Basic, Standard, Premium (geo-replication, private link). Integrates natively with AKS.

```bash
# Create ACR and push an image
az acr create --resource-group myRG --name myACR --sku Standard

az acr login --name myACR

docker tag myapp:latest myacr.azurecr.io/myapp:v1
docker push myacr.azurecr.io/myapp:v1
```

---

### 2.8 Infrastructure as Code (IaC)

#### ARM Templates

JSON-based declarative templates for deploying Azure resources. Verbose but powerful. Support linked/nested templates, what-if deployment, complete/incremental modes.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageName": {
      "type": "string",
      "minLength": 3,
      "maxLength": 24
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2023-01-01",
      "name": "[parameters('storageName')]",
      "location": "[resourceGroup().location]",
      "sku": { "name": "Standard_LRS" },
      "kind": "StorageV2"
    }
  ]
}
```

#### Bicep

Domain-specific language (DSL) that compiles to ARM templates. Cleaner, more readable syntax.

**Key Features**: Modules, parameters, variables, outputs, condition/loop support, first-class VS Code extension with IntelliSense.

```bicep
// main.bicep
param location string = resourceGroup().location
param storageName string

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

output storageId string = storageAccount.id
```

**Bicep Modules:**

```bicep
// modules/storage.bicep
param name string
param location string

resource sa 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: name
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
}

output id string = sa.id
```

```bicep
// main.bicep using module
module storage 'modules/storage.bicep' = {
  name: 'storageDeployment'
  params: {
    name: 'mystorageacct'
    location: resourceGroup().location
  }
}
```

```bash
# Deploy Bicep
az deployment group create \
  --resource-group myRG \
  --template-file main.bicep \
  --parameters storageName=mystorageacct
```

#### Azure CLI vs Azure PowerShell

| Feature        | Azure CLI (`az`)           | Azure PowerShell (`Az`)         |
|----------------|----------------------------|---------------------------------|
| Syntax         | Bash-style                 | PowerShell cmdlets              |
| Cross-platform | Yes                        | Yes (PowerShell 7+)             |
| Output         | JSON, table, tsv, yaml     | Objects (pipe-friendly)         |
| Best For       | Linux/Mac admins, scripting | Windows admins, complex logic   |

---

### 2.9 Messaging

#### Azure Service Bus

Enterprise message broker with queues and topics/subscriptions. Supports transactions, duplicate detection, dead-letter queues, sessions, message ordering. Tiers: Basic, Standard, Premium.

#### Event Grid

Reactive event routing service. Publishes events from Azure services or custom sources to subscribers (Functions, Logic Apps, Webhooks). Uses push delivery with retry, dead-lettering, and filtering.

#### Event Hubs

Big data streaming platform and event ingestion service. Millions of events per second. Use for telemetry, log aggregation, real-time analytics. Supports Apache Kafka protocol.

#### Queue Storage

Simple, cost-effective message queuing in a Storage Account. Up to 64 KB per message, up to 500 TB queue. Good for decoupling components. Lacks advanced features of Service Bus.

| Feature              | Queue Storage        | Service Bus Queue       |
|----------------------|----------------------|-------------------------|
| Max Message Size     | 64 KB                | 256 KB / 100 MB (Premium) |
| Ordering Guarantee   | No                   | FIFO (sessions)         |
| Transactions         | No                   | Yes                     |
| Dead-lettering       | No                   | Yes                     |
| Cost                 | Very low             | Higher                  |

---

## 3. Practical Examples

### Create a Virtual Machine

```bash
# Create resource group
az group create --name devRG --location eastus

# Create a Linux VM
az vm create \
  --resource-group devRG \
  --name devVM \
  --image Ubuntu2204 \
  --size Standard_B2s \
  --admin-username azureuser \
  --generate-ssh-keys \
  --public-ip-sku Standard

# Open port 80
az vm open-port --resource-group devRG --name devVM --port 80
```

### Create a Storage Account

```bash
az storage account create \
  --name devstorageacct2026 \
  --resource-group devRG \
  --location eastus \
  --sku Standard_ZRS \
  --kind StorageV2 \
  --access-tier Hot
```

### Create a VNet with Subnets and NSG

```bash
az network vnet create \
  --resource-group devRG \
  --name devVNet \
  --address-prefix 10.0.0.0/16

az network vnet subnet create \
  --resource-group devRG \
  --vnet-name devVNet \
  --name webSubnet \
  --address-prefix 10.0.1.0/24

az network vnet subnet create \
  --resource-group devRG \
  --vnet-name devVNet \
  --name dbSubnet \
  --address-prefix 10.0.2.0/24

az network nsg create --resource-group devRG --name webNSG

az network nsg rule create \
  --resource-group devRG \
  --nsg-name webNSG \
  --name AllowWeb \
  --priority 100 \
  --direction Inbound \
  --access Allow \
  --protocol Tcp \
  --destination-port-ranges 80 443 \
  --source-address-prefixes '*'
```

### Create an AKS Cluster

```bash
az aks create \
  --resource-group devRG \
  --name devAKS \
  --node-count 2 \
  --node-vm-size Standard_DS2_v2 \
  --network-plugin azure \
  --enable-managed-identity \
  --enable-addons monitoring \
  --generate-ssh-keys

az aks get-credentials --resource-group devRG --name devAKS
kubectl get nodes
```

### Create a Function App

```bash
az storage account create \
  --name funcstorageacct \
  --resource-group devRG \
  --location eastus \
  --sku Standard_LRS

az functionapp create \
  --resource-group devRG \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --name devFuncApp2026 \
  --storage-account funcstorageacct
```

### Deploy with Bicep

```bash
# Validate template
az deployment group validate \
  --resource-group devRG \
  --template-file main.bicep \
  --parameters storageName=mystorageacct

# What-if (preview changes)
az deployment group what-if \
  --resource-group devRG \
  --template-file main.bicep \
  --parameters storageName=mystorageacct

# Deploy
az deployment group create \
  --resource-group devRG \
  --template-file main.bicep \
  --parameters storageName=mystorageacct
```

---

## 4. Cheat Sheet

| Category            | Service                        | Description                                          |
|---------------------|--------------------------------|------------------------------------------------------|
| Compute             | Virtual Machines               | IaaS VMs running Linux or Windows                    |
| Compute             | Azure Functions                | Serverless event-driven code execution               |
| Compute             | App Service                    | Managed PaaS for web apps and APIs                   |
| Compute             | Container Instances            | Run containers without managing infrastructure       |
| Compute             | Azure Kubernetes Service       | Managed Kubernetes orchestration                     |
| Storage             | Blob Storage                   | Object storage for unstructured data                 |
| Storage             | Azure Files                    | Managed SMB/NFS file shares                          |
| Storage             | Azure Disk                     | Block storage for VMs                                |
| Networking          | Virtual Network                | Private network with subnets and security            |
| Networking          | Application Gateway            | L7 load balancer with WAF                            |
| Networking          | Azure Load Balancer            | L4 high-performance load balancer                    |
| Networking          | Azure Firewall                 | Managed stateful network firewall                    |
| Networking          | ExpressRoute                   | Private dedicated connection to Azure                |
| Networking          | VPN Gateway                    | Encrypted site-to-site tunnel over internet          |
| Database            | Azure SQL Database             | Managed SQL Server database                          |
| Database            | Cosmos DB                      | Globally distributed multi-model NoSQL               |
| Database            | Azure Cache for Redis          | In-memory caching and message broker                 |
| Identity            | Microsoft Entra ID             | Cloud identity and access management                 |
| Identity            | Key Vault                      | Secrets, keys, and certificate management            |
| Security            | Defender for Cloud             | Security posture management and threat protection    |
| Monitoring          | Azure Monitor                  | Metrics, logs, and alerts platform                   |
| Monitoring          | Application Insights           | Application performance monitoring                   |
| Monitoring          | Azure Advisor                  | Personalized best-practice recommendations           |
| DevOps              | Azure DevOps                   | End-to-end DevOps toolchain                          |
| DevOps              | Azure Container Registry       | Private Docker/OCI image registry                    |
| IaC                 | ARM Templates                  | JSON-based declarative resource deployment           |
| IaC                 | Bicep                          | DSL that compiles to ARM, cleaner syntax             |
| Messaging           | Service Bus                    | Enterprise message broker with queues and topics     |
| Messaging           | Event Grid                     | Reactive event routing service                       |
| Messaging           | Event Hubs                     | Big data streaming and event ingestion               |
| Governance          | Azure Policy                   | Enforce organizational standards on resources        |
| Governance          | Management Groups              | Organize subscriptions for governance at scale       |
| Cost Management     | Cost Management + Billing      | Monitor, allocate, and optimize cloud spending       |

---

## 5. Hands-on Labs

### Lab 1: Deploy an App to AKS with ACR

**Objective**: Build a container image, push it to ACR, and deploy to AKS.

```bash
# Step 1: Create resource group
az group create --name lab-rg --location eastus

# Step 2: Create ACR
az acr create --resource-group lab-rg --name labacr2026 --sku Standard

# Step 3: Build and push image using ACR Tasks
az acr build --registry labacr2026 --image myapp:v1 .

# Step 4: Create AKS cluster
az aks create \
  --resource-group lab-rg \
  --name lab-aks \
  --node-count 2 \
  --enable-managed-identity \
  --attach-acr labacr2026 \
  --generate-ssh-keys

# Step 5: Get AKS credentials
az aks get-credentials --resource-group lab-rg --name lab-aks
```

**Kubernetes Deployment Manifest:**

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: labacr2026.azurecr.io/myapp:v1
          ports:
            - containerPort: 8080
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "250m"
              memory: "256Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: LoadBalancer
  selector:
    app: myapp
  ports:
    - port: 80
      targetPort: 8080
```

```bash
# Step 6: Deploy
kubectl apply -f deployment.yaml
kubectl get svc myapp-service --watch
```

---

### Lab 2: Build CI/CD with Azure DevOps Pipelines

**Objective**: Set up a CI/CD pipeline that builds, tests, and deploys a web app to Azure App Service.

**Pipeline YAML (`azure-pipelines.yml`):**

```yaml
trigger:
  branches:
    include:
      - main

variables:
  azureSubscription: 'my-azure-service-connection'
  appName: 'lab-webapp-2026'

stages:
  - stage: CI
    displayName: 'Build & Test'
    jobs:
      - job: Build
        pool:
          vmImage: 'ubuntu-latest'
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: '20.x'
          - script: |
              npm ci
              npm run build
              npm test
            displayName: 'Install, Build, Test'
          - task: ArchiveFiles@2
            inputs:
              rootFolderOrFile: '$(System.DefaultWorkingDirectory)/dist'
              includeRootFolder: false
              archiveType: 'zip'
              archiveFile: '$(Build.ArtifactStagingDirectory)/app.zip'
          - publish: $(Build.ArtifactStagingDirectory)/app.zip
            artifact: drop

  - stage: CD
    displayName: 'Deploy to Production'
    dependsOn: CI
    condition: succeeded()
    jobs:
      - deployment: Deploy
        environment: 'production'
        pool:
          vmImage: 'ubuntu-latest'
        strategy:
          runOnce:
            deploy:
              steps:
                - download: current
                  artifact: drop
                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: $(azureSubscription)
                    appType: 'webAppLinux'
                    appName: $(appName)
                    package: '$(Pipeline.Workspace)/drop/app.zip'
```

**Steps:**
1. Create an Azure DevOps project.
2. Push code to Azure Repos.
3. Create a Service Connection to your Azure subscription.
4. Add `azure-pipelines.yml` to the repo root.
5. Create a new pipeline pointing to the YAML file.
6. Run the pipeline — it will build, test, and deploy automatically.

---

### Lab 3: Deploy Infrastructure with Bicep Templates

**Objective**: Deploy a web app with an App Service Plan and a Storage Account using Bicep.

```bicep
// infra/main.bicep
targetScope = 'resourceGroup'

param location string = resourceGroup().location
param appName string
param storageName string

@allowed(['F1', 'B1', 'S1', 'P1v3'])
param appServiceSku string = 'B1'

resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: '${appName}-plan'
  location: location
  sku: {
    name: appServiceSku
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource webApp 'Microsoft.Web/sites@2023-01-01' = {
  name: appName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      alwaysOn: appServiceSku != 'F1'
    }
  }
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

output webAppUrl string = 'https://${webApp.properties.defaultHostName}'
output storageAccountId string = storageAccount.id
```

```bash
# Deploy
az group create --name infra-lab-rg --location eastus

az deployment group create \
  --resource-group infra-lab-rg \
  --template-file infra/main.bicep \
  --parameters appName=lab-webapp-2026 storageName=labstorage2026

# Verify
az webapp show --resource-group infra-lab-rg --name lab-webapp-2026 --query defaultHostName -o tsv
```

---

## 6. Real-world Scenarios

### Scenario 1: Design CI/CD with Azure DevOps for Microservices

**Problem**: A team has 5 microservices (APIs, workers, frontend) in a monorepo. They need independent build/deploy pipelines.

**Solution:**

1. **Repo Structure**: Monorepo with path-based triggers.
2. **Pipeline per Service**: Each service has its own `azure-pipelines.yml` triggered by changes to its directory.
3. **Shared Templates**: Extract common steps (Docker build, push, deploy) into YAML templates.
4. **Environments & Approvals**: Dev deploys automatically; staging and production require manual approval gates.
5. **Infrastructure**: AKS cluster with namespaces per environment. ACR for images. Helm charts for deployments.
6. **Secrets**: Key Vault integrated with AKS via CSI driver; service connections use Managed Identity.

```yaml
# Path-based trigger example for order-service
trigger:
  branches:
    include: [main]
  paths:
    include: [services/order-service/**]
```

### Scenario 2: Migrate On-Premises Workloads to Azure

**Problem**: Company runs a 3-tier app (web, app, database) on-premises and needs to migrate to Azure.

**Approach (Phased):**

1. **Assess**: Use Azure Migrate to discover and assess on-prem VMs. Evaluate readiness, sizing, and cost estimates.
2. **Phase 1 — Lift & Shift (Rehost)**:
   - Migrate VMs to Azure using Azure Migrate (agentless/agent-based).
   - Database → Azure SQL Managed Instance using Azure Database Migration Service.
   - Networking → Site-to-Site VPN or ExpressRoute for hybrid connectivity.
3. **Phase 2 — Modernize (Refactor)**:
   - Web tier → Azure App Service.
   - App tier → Containerize and deploy to AKS.
   - Database → Azure SQL Database (serverless).
4. **Phase 3 — Optimize**:
   - Implement autoscaling, Azure CDN, caching with Redis.
   - Set up Azure Monitor, alerts, and Application Insights.
   - Apply Azure Policy and cost management.

### Scenario 3: Implement Governance with Management Groups and Azure Policy

**Problem**: Enterprise with 50+ subscriptions needs centralized governance, consistent tagging, and security compliance.

**Solution:**

1. **Management Group Hierarchy**:
   ```
   Root Management Group
   ├── Production
   │   ├── Sub-Prod-EastUS
   │   └── Sub-Prod-WestEU
   ├── Development
   │   └── Sub-Dev
   └── Sandbox
       └── Sub-Sandbox
   ```
2. **Azure Policy Assignments**:
   - Require tags on all resources (`costCenter`, `environment`, `owner`).
   - Restrict VM SKUs to approved list.
   - Enforce storage encryption.
   - Deny public IP creation in Production.
   - Audit non-compliant resources.
3. **Azure Blueprints / Deployment Stacks**: Package policies, role assignments, and ARM templates for consistent environment setup.
4. **Cost Management**: Set budgets per subscription, configure alerts at 80%/100% thresholds, use Azure Advisor for optimization.
5. **Security**: Enable Defender for Cloud on all subscriptions, enforce Conditional Access policies via Entra ID.

---

## 7. Interview Q&A

### Basic (Q1–Q15)

**Q1: What is Microsoft Azure?**

> Azure is Microsoft's cloud computing platform providing IaaS, PaaS, SaaS, and serverless services across 60+ global regions. It supports compute, storage, networking, databases, AI, IoT, DevOps, and more.

**Q2: What is a Region and Availability Zone in Azure?**

> A Region is a geographic area containing one or more datacenters. An Availability Zone is a physically separate datacenter within a region with independent power, cooling, and networking — used for high availability (99.99% SLA).

**Q3: What is Azure Resource Manager (ARM)?**

> ARM is the management layer through which all Azure resource operations pass. It provides consistent management (RBAC, tags, locks, policies) regardless of the tool used (Portal, CLI, SDK).

**Q4: What is a Resource Group?**

> A logical container that holds related Azure resources sharing the same lifecycle. Resources in a group can be in different regions. Deleting a resource group deletes all contained resources.

**Q5: What are the different VM sizes in Azure?**

> Azure VMs come in series: B-series (burstable, dev/test), D-series (general purpose), E-series (memory optimized), F-series (compute optimized), N-series (GPU-enabled for ML/rendering), L-series (storage optimized).

**Q6: What is Azure Blob Storage?**

> Object storage for unstructured data. Blobs are stored in containers within storage accounts. Supports three access tiers: Hot (frequent access), Cool (infrequent, 30+ days), Archive (rare, 180+ days).

**Q7: What is a Virtual Network (VNet)?**

> A VNet is a private, isolated network in Azure. It enables Azure resources to communicate with each other, the internet, and on-premises networks. It supports subnets, NSGs, route tables, and peering.

**Q8: What is Azure App Service?**

> A fully managed PaaS for hosting web apps, APIs, and mobile backends. Supports .NET, Java, Node.js, Python, and PHP. Features include deployment slots, autoscaling, custom domains, and SSL.

**Q9: What is Azure Functions?**

> A serverless compute service that runs code in response to events (HTTP requests, timers, queue messages). You pay only for execution time. Supports multiple languages and integrates with many Azure services.

**Q10: What is Azure Kubernetes Service (AKS)?**

> A managed Kubernetes service where Azure handles the control plane (API server, etcd, scheduler). You manage the worker nodes. Supports autoscaling, RBAC, Azure AD integration, and Azure Monitor.

**Q11: What is Microsoft Entra ID?**

> Formerly Azure Active Directory (Azure AD). A cloud-based identity and access management service for signing in and accessing Azure resources, Microsoft 365, and third-party applications. Supports SSO, MFA, and Conditional Access.

**Q12: What is RBAC in Azure?**

> Role-Based Access Control assigns permissions to users, groups, or service principals at a specific scope. Built-in roles include Owner, Contributor, Reader, and User Access Administrator.

**Q13: What is Azure Key Vault?**

> A cloud service for securely storing and accessing secrets (passwords, API keys), encryption keys, and certificates. Integrates with Managed Identities for credential-free access from Azure services.

**Q14: What is Azure DevOps?**

> A suite of DevOps tools: Azure Repos (Git), Azure Pipelines (CI/CD), Azure Boards (work tracking), Azure Artifacts (package feeds), Azure Test Plans (manual testing). Available as cloud service or on-prem (Azure DevOps Server).

**Q15: What is the difference between Azure CLI and Azure PowerShell?**

> Azure CLI uses bash-style `az` commands, outputs JSON by default, and is preferred by Linux users. Azure PowerShell uses `Az` cmdlets, outputs objects, and is preferred for complex scripting on Windows. Both are cross-platform.

---

### Intermediate (Q16–Q35)

**Q16: What is the difference between NSGs and Azure Firewall?**

> NSGs are basic L3/L4 stateful filters applied at the subnet or NIC level. Azure Firewall is a centralized, managed L3–L7 firewall with FQDN filtering, threat intelligence, DNAT, and centralized logging. Use NSGs for micro-segmentation and Azure Firewall for perimeter security.

**Q17: What are Managed Identities?**

> Azure-managed identities for services, eliminating the need to store credentials. System-assigned identities are tied to a resource's lifecycle. User-assigned identities are standalone and can be shared across multiple resources.

**Q18: What is VNet Peering?**

> Connects two VNets allowing resources to communicate using private IPs. Traffic uses the Microsoft backbone network. Works across regions (global peering). Non-transitive — if VNet A is peered with B and B with C, A cannot reach C without direct peering.

**Q19: How does Azure Load Balancer differ from Application Gateway?**

> Load Balancer operates at L4 (TCP/UDP) — fast, protocol-agnostic. Application Gateway operates at L7 (HTTP/HTTPS) — supports URL routing, SSL termination, WAF, cookie affinity. Use LB for non-HTTP traffic, App Gateway for web traffic.

**Q20: What is Azure Policy?**

> A governance service that creates, assigns, and manages policies to enforce rules on resources. Policies can audit, deny, or auto-remediate non-compliant resources. Assigned at management group, subscription, or resource group scope.

**Q21: What are Availability Sets vs Availability Zones?**

> Availability Sets distribute VMs across fault domains (racks) and update domains within a single datacenter — protects from hardware failures. Availability Zones distribute across physically separate datacenters in a region — protects from datacenter-level failures.

**Q22: What is Azure Container Registry (ACR)?**

> A managed private Docker registry. Supports Docker images, OCI artifacts, Helm charts. Features geo-replication (Premium), ACR Tasks for automated builds, and native integration with AKS using managed identities.

**Q23: What is the difference between Bicep and ARM templates?**

> Both define Azure infrastructure declaratively. ARM templates use verbose JSON. Bicep is a DSL that compiles to ARM JSON with cleaner syntax, modules, type safety, and better tooling (VS Code extension). Bicep is recommended for new projects.

**Q24: Explain Azure Functions hosting plans.**

> Consumption Plan: auto-scales, pay-per-execution, cold start possible. Premium Plan: pre-warmed instances (no cold start), VNet integration, unlimited execution time. Dedicated Plan: runs on App Service Plan, predictable billing, best for always-on workloads.

**Q25: What is Azure Cosmos DB and when would you use it?**

> A globally distributed, multi-model NoSQL database. Supports SQL, MongoDB, Cassandra, Gremlin, and Table APIs. Use when you need single-digit ms latency, multi-region writes, 99.999% availability, or flexible schema. Ideal for global apps, IoT, and real-time personalization.

**Q26: How does Azure Monitor work?**

> Azure Monitor collects metrics (numeric time-series) and logs (structured data) from Azure resources, applications, and OS. Data is analyzed with KQL in Log Analytics. Alerts trigger notifications or automated actions. Application Insights provides APM for code-level diagnostics.

**Q27: What is Conditional Access in Entra ID?**

> A policy engine that evaluates signals (user identity, device state, location, app, sign-in risk) during authentication and enforces controls: allow, block, require MFA, require compliant device, or limit session. Zero Trust enforcement mechanism.

**Q28: What is ExpressRoute?**

> A private, dedicated connection from on-premises to Azure that bypasses the public internet. Provides higher reliability, faster speeds (up to 100 Gbps), and lower latency. Use for regulatory compliance, large data transfers, or mission-critical workloads.

**Q29: What are Deployment Slots in App Service?**

> Live instances of your app (e.g., staging, production). You deploy to a staging slot, validate, then swap to production with zero downtime. Swap is instant (pointer change). If issues arise, swap back. Settings can be slot-specific.

**Q30: What is Azure Service Bus?**

> An enterprise message broker supporting queues (point-to-point) and topics/subscriptions (pub/sub). Supports transactions, sessions (FIFO), duplicate detection, dead-lettering, and scheduled delivery. Use for reliable async communication between microservices.

**Q31: What is Azure Landing Zone?**

> A well-architected, multi-subscription Azure environment that follows Cloud Adoption Framework best practices. Includes identity, networking (hub-spoke), governance (policies), security, and management foundations. Starting point for enterprise-scale Azure adoption.

**Q32: How does autoscaling work in AKS?**

> AKS supports multiple autoscaling mechanisms: Horizontal Pod Autoscaler (HPA) scales pods based on CPU/memory or custom metrics. Cluster Autoscaler adds/removes nodes based on pod scheduling needs. KEDA enables event-driven scaling (queue length, HTTP requests).

**Q33: What is the difference between Service Bus and Event Grid?**

> Service Bus is for reliable messaging with queues/topics (pull model, guaranteed delivery, ordering). Event Grid is for reactive event routing (push model, near real-time, lightweight notifications). Use Service Bus for commands/transactions; Event Grid for events/notifications.

**Q34: What is Azure Advisor?**

> A free recommendation engine that analyzes your deployed resources and provides actionable suggestions across five categories: Cost, Security, Reliability, Operational Excellence, and Performance.

**Q35: How do you secure secrets in Azure DevOps pipelines?**

> Use Variable Groups linked to Azure Key Vault. Secrets are fetched at runtime and never exposed in logs. Additionally, use service connections with Managed Identity or service principals (not passwords). Mark pipeline variables as secret. Enable credential scanning in pipelines.

---

### Advanced (Q36–Q50)

**Q36: Explain Azure networking for AKS — kubenet vs Azure CNI.**

> **kubenet**: Pods get IPs from a virtual overlay network. Nodes get VNet IPs, pods use NAT to communicate externally. Simpler, conserves VNet IPs. **Azure CNI**: Every pod gets a VNet IP directly. Enables direct connectivity with VNet resources, NSGs on pods, and Azure network policies. Use Azure CNI for production with VNet integration requirements.

**Q37: How do you implement disaster recovery in Azure?**

> Use Azure Site Recovery (ASR) for VM replication to a secondary region. For databases, enable geo-replication (Azure SQL) or multi-region writes (Cosmos DB). Use Traffic Manager or Front Door for DNS failover. Design with paired regions, zone-redundant services, and a tested DR runbook. Define RPO/RTO targets.

**Q38: What is the Azure Well-Architected Framework?**

> A set of guiding tenets across five pillars: **Reliability** (resiliency, recovery), **Security** (defense in depth), **Cost Optimization** (efficient spending), **Operational Excellence** (monitoring, automation), **Performance Efficiency** (scaling, load testing). Used during architecture reviews via Azure Well-Architected Review tool.

**Q39: How do you implement zero-trust security in Azure?**

> Verify explicitly (Conditional Access, MFA), use least privilege (RBAC, PIM), assume breach (micro-segmentation with NSGs, Azure Firewall). Key services: Entra ID for identity, Key Vault for secrets, Defender for Cloud for posture, Private Endpoints for network isolation, Managed Identities for service-to-service auth.

**Q40: Explain Azure Policy vs RBAC.**

> RBAC controls who can perform actions (identity-based access). Azure Policy controls what properties resources can have (resource compliance). RBAC: "Can this user create a VM?" Policy: "Can any VM use this SKU?" They complement each other — RBAC for authorization, Policy for governance.

**Q41: How do you manage costs in Azure?**

> Use Azure Cost Management to track spending. Set budgets with alerts. Use Azure Advisor cost recommendations. Right-size VMs. Use Reserved Instances (1 or 3 year) for predictable workloads. Use Spot VMs for interruptible workloads. Apply auto-shutdown on dev VMs. Tag resources for cost allocation. Review pricing calculator before provisioning.

**Q42: What are Private Endpoints?**

> A network interface with a private IP from your VNet, connecting privately to an Azure service (Storage, SQL, Key Vault). Traffic stays on the Microsoft backbone. Eliminates exposure to the public internet. Used with Private DNS Zones for name resolution.

**Q43: How do you implement GitOps with AKS?**

> Use Azure Arc-enabled Kubernetes or Flux v2 (built into AKS). Flux watches a Git repo for Kubernetes manifests or Helm charts and continuously reconciles the cluster state. Changes are made via Git commits (pull requests), providing audit trails and rollback capabilities.

**Q44: What is Azure Front Door?**

> A global L7 load balancer and CDN with WAF, SSL offloading, URL-based routing, session affinity, and health probes. Provides global anycast for low-latency routing. Supports A/B testing, blue-green deployments, and multi-region failover.

**Q45: How do you design a multi-region architecture in Azure?**

> Deploy to two or more paired regions. Use Azure Front Door or Traffic Manager for global load balancing. Use Cosmos DB with multi-region writes or Azure SQL with active geo-replication. Deploy infrastructure with Bicep using parameters per region. Use Azure DevOps with multi-stage pipelines deploying to each region. Define RTO/RPO and test failover regularly.

**Q46: What are Azure Management Groups and how do you use them?**

> Containers above subscriptions for organizing governance at scale. Up to 6 levels of nesting. Apply Azure Policy and RBAC at the management group level — inherited by all child subscriptions and resources. Essential for enterprises managing multiple subscriptions across teams.

**Q47: How do you implement blue-green deployments in Azure?**

> **App Service**: Use deployment slots — deploy to staging, validate, swap to production. **AKS**: Deploy new version as a separate deployment, switch service selector. Use ingress controller or Azure Front Door for traffic splitting. **Azure DevOps**: Configure stages with approval gates for production promotion.

**Q48: What is Azure Lighthouse?**

> Enables cross-tenant management. Service providers can manage customer Azure resources at scale without switching directories. Provides delegated access with RBAC, audit logging, and Entra ID authentication. Used by MSPs and multi-tenant management scenarios.

**Q49: How do you secure an AKS cluster?**

> Enable Entra ID integration for RBAC. Use Azure Policy for Kubernetes (OPA Gatekeeper). Enable Defender for Containers. Use Private Clusters (private API server). Network policies (Calico/Azure) for pod-to-pod segmentation. Managed Identities for pod access to Azure services (Workload Identity). Scan images in ACR. Limit node SSH access. Enable audit logs.

**Q50: Explain Azure Landing Zones and the Cloud Adoption Framework (CAF).**

> CAF is Microsoft's guidance for cloud adoption, covering strategy, planning, readiness, migration, innovation, and governance. Azure Landing Zones implement CAF at the platform level — providing a scalable, modular environment with pre-configured identity (Entra ID), networking (hub-spoke), governance (policies), security (Defender), and management (Monitor). Deployed via Enterprise-Scale reference architectures using Bicep or Terraform modules. Key components: Management Groups, Platform subscriptions (connectivity, identity, management), Application Landing Zone subscriptions.

---

*Last updated: April 2026*
