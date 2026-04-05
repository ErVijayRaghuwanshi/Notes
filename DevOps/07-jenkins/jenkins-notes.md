# Jenkins – DevOps Interview Preparation Notes

---

## 1. Introduction

### What is Jenkins?

Jenkins is an open-source automation server written in Java that enables developers to build, test, and deploy software through Continuous Integration (CI) and Continuous Delivery (CD) pipelines. It is one of the most widely adopted CI/CD tools in the DevOps ecosystem.

### Why Jenkins is Important for DevOps

- **Automation**: Automates repetitive tasks like building, testing, and deploying code.
- **Extensibility**: Over 1,800 plugins available to integrate with virtually any tool in the DevOps toolchain.
- **Pipeline as Code**: Jenkinsfile allows defining build pipelines in version-controlled code.
- **Distributed Builds**: Master-agent architecture supports scaling across multiple machines.
- **Community**: One of the largest open-source communities in the CI/CD space.
- **Free & Open Source**: No licensing cost, enterprise-grade capabilities.

### Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                    Jenkins Controller                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │ Web UI   │ │ REST API │ │ Scheduler│ │ Plugin Mgr │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘  │
│  ┌──────────────────────────────────────────────────┐    │
│  │              Job / Pipeline Engine                │    │
│  └──────────────────────────────────────────────────┘    │
└─────────────┬────────────────┬───────────────┬───────────┘
              │                │               │
     ┌────────▼──────┐ ┌──────▼───────┐ ┌─────▼────────┐
     │   Agent 1     │ │   Agent 2    │ │   Agent 3    │
     │ (Linux/Docker)│ │  (Windows)   │ │  (macOS)     │
     └───────────────┘ └──────────────┘ └──────────────┘
```

- **Controller (Master)**: Manages configuration, schedules jobs, dispatches builds to agents, monitors agents, and serves the web UI.
- **Agents (Slaves)**: Execute build jobs dispatched by the controller. Can run on any OS.
- **Executors**: Threads on agents that perform the actual work.
- **Nodes**: Any machine that is part of the Jenkins environment (controller + agents).

---

## 2. Core Concepts

### 2.1 Jenkins Architecture (Master/Agent, Distributed Builds)

**Controller (Master) Responsibilities:**
- Hosting the Jenkins web UI
- Storing configuration (jobs, credentials, plugins)
- Scheduling and dispatching builds
- Monitoring agents
- Recording build results and artifacts

**Agent Responsibilities:**
- Executing build steps as instructed by the controller
- Reporting results back to the controller

**Communication Protocols:**
- **SSH**: Controller connects to agent via SSH (Linux/macOS)
- **JNLP (Java Network Launch Protocol)**: Agent connects back to controller (Windows, firewalled environments)
- **Kubernetes Plugin**: Dynamically provisions pods as agents

**Labels**: Tags assigned to agents to categorize them (e.g., `linux`, `docker`, `gpu`). Pipelines use labels to target specific agent types.

```groovy
agent { label 'linux && docker' }
```

### 2.2 Jenkinsfile (Declarative vs Scripted Pipeline)

A **Jenkinsfile** is a text file checked into source control that defines the CI/CD pipeline.

#### Declarative Pipeline

- Structured, opinionated syntax
- Begins with `pipeline { }` block
- Easier to read and write
- Built-in error handling with `post` blocks
- Recommended for most use cases

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'make build'
            }
        }
    }
}
```

#### Scripted Pipeline

- Full Groovy-based scripting
- Begins with `node { }` block
- More flexible but harder to maintain
- Greater programmatic control

```groovy
node {
    stage('Build') {
        sh 'make build'
    }
}
```

| Feature | Declarative | Scripted |
|---------|------------|----------|
| Syntax | Structured | Free-form Groovy |
| Starts with | `pipeline { }` | `node { }` |
| Error handling | `post` block | `try/catch/finally` |
| Restart from stage | Yes | No |
| Learning curve | Lower | Higher |
| Flexibility | Limited | Maximum |
| Validation | `validateDeclarativePipeline` | None |

### 2.3 Pipeline Stages, Steps, Post Actions

#### Stages
Logical divisions of a pipeline (e.g., Build, Test, Deploy). Each stage contains steps.

```groovy
stages {
    stage('Build') { steps { ... } }
    stage('Test')  { steps { ... } }
    stage('Deploy'){ steps { ... } }
}
```

#### Steps
Individual tasks within a stage (shell commands, plugin invocations, etc.).

```groovy
steps {
    sh 'mvn clean install'           // Shell command
    echo 'Build complete'            // Print message
    archiveArtifacts 'target/*.jar'  // Archive artifacts
    junit 'target/surefire-reports/*.xml' // Publish test results
}
```

#### Post Actions
Execute after stages complete, based on build status:

```groovy
post {
    always {
        cleanWs()  // Always clean workspace
    }
    success {
        slackSend message: "Build succeeded!"
    }
    failure {
        mail to: 'team@example.com', subject: 'Build Failed'
    }
    unstable {
        echo 'Tests failed but build succeeded'
    }
    changed {
        echo 'Pipeline status changed from last run'
    }
    aborted {
        echo 'Pipeline was aborted'
    }
}
```

### 2.4 Shared Libraries

Shared libraries allow reusing pipeline code across multiple projects.

**Directory Structure:**
```
(root)
├── vars/
│   ├── myPipeline.groovy      # Global variables / functions
│   └── myPipeline.txt         # Help documentation
├── src/
│   └── org/company/
│       └── Utils.groovy       # Groovy classes
└── resources/
    └── templates/
        └── deploy.yaml        # Non-Groovy resources
```

**Configuration:** In Jenkins → Manage Jenkins → Configure System → Global Pipeline Libraries.

**Usage in Jenkinsfile:**
```groovy
@Library('my-shared-library') _

pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                myPipeline()  // Call from vars/
            }
        }
    }
}
```

**Loading specific version:**
```groovy
@Library('my-shared-library@main') _
```

### 2.5 Plugins Ecosystem

Jenkins functionality is extended through plugins. Key categories:

| Category | Popular Plugins |
|----------|----------------|
| SCM | Git, GitHub, GitLab, Bitbucket |
| Build Tools | Maven, Gradle, Ant, NodeJS |
| Testing | JUnit, Cobertura, SonarQube |
| Notifications | Slack, Email Extension, MS Teams |
| Artifacts | Nexus, Artifactory, S3 |
| Containers | Docker, Kubernetes, Docker Compose |
| Cloud | AWS, Azure, GCP |
| Security | Role-Based Access, LDAP, OWASP |
| Pipeline | Pipeline, Blue Ocean, Multibranch |
| Infrastructure | Ansible, Terraform, Chef |

**Plugin Management:**
- Install: Manage Jenkins → Manage Plugins → Available
- Update: Manage Jenkins → Manage Plugins → Updates
- CLI: `jenkins-plugin-cli --plugins git:latest`

### 2.6 Credentials Management

Jenkins provides a built-in credential store for managing secrets securely.

**Credential Types:**
- Username & Password
- SSH Username with Private Key
- Secret Text
- Secret File
- Certificate (PKCS#12)

**Credential Scopes:**
- **Global**: Available to all jobs
- **System**: Available only on the Jenkins controller (for internal use)
- **Folder**: Scoped to a specific folder and its children

**Using Credentials in Pipeline:**
```groovy
pipeline {
    agent any
    environment {
        DOCKER_CREDS = credentials('docker-hub-creds')  // binds _USR and _PSW
        AWS_KEY = credentials('aws-secret-key')
    }
    stages {
        stage('Deploy') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'docker-hub-creds',
                        usernameVariable: 'USER',
                        passwordVariable: 'PASS'
                    )
                ]) {
                    sh 'docker login -u $USER -p $PASS'
                }
            }
        }
    }
}
```

### 2.7 Webhooks and Triggers

**Build Triggers:**

```groovy
pipeline {
    agent any
    triggers {
        pollSCM('H/5 * * * *')      // Poll SCM every 5 minutes
        cron('H 2 * * 1-5')          // Nightly build on weekdays at 2 AM
        upstream('other-job')         // Trigger after another job
        githubPush()                  // GitHub webhook push
    }
    stages { ... }
}
```

**Webhook Setup (GitHub):**
1. Go to Repository → Settings → Webhooks
2. Payload URL: `http://<jenkins-url>/github-webhook/`
3. Content type: `application/json`
4. Select events: Push, Pull Request
5. In Jenkins job: check "GitHub hook trigger for GITScm polling"

**Generic Webhook Trigger:**
```groovy
triggers {
    GenericTrigger(
        genericVariables: [
            [key: 'BRANCH', value: '$.ref']
        ],
        token: 'my-token',
        causeString: 'Triggered by webhook'
    )
}
```

### 2.8 Blue Ocean UI

Blue Ocean is a modern, visual UI for Jenkins pipelines.

**Features:**
- Visual pipeline editor
- Intuitive pipeline visualization with stage-by-stage view
- Built-in support for pull request decoration
- Native GitHub/Bitbucket integration
- Personalized dashboard
- Branch and PR-aware views

**Installation:**
- Manage Jenkins → Manage Plugins → Install "Blue Ocean"
- Access via: `http://<jenkins-url>/blue`

> **Note:** Blue Ocean development has been paused. The Jenkins community is working on a new UI initiative. However, it remains widely used and relevant for interviews.

### 2.9 Pipeline Best Practices

1. **Use Declarative Pipeline** over Scripted when possible
2. **Keep Jenkinsfile in source control** (Pipeline as Code)
3. **Use Shared Libraries** for reusable pipeline logic
4. **Avoid complex Groovy** in Jenkinsfile — move logic to shared libraries
5. **Use `agent none`** at the top level and assign agents per stage to optimize resource usage
6. **Use `parallel` stages** to reduce build time
7. **Clean workspace** with `cleanWs()` in post actions
8. **Use `timeout` and `retry`** for resilience
9. **Externalize configuration** using parameters and environment variables
10. **Use credentials binding** — never hardcode secrets
11. **Archive artifacts and test results** for traceability
12. **Use `when` conditions** to skip unnecessary stages
13. **Pin plugin versions** in production
14. **Implement proper error handling** with `post` blocks
15. **Use lightweight executors** (Docker/Kubernetes agents) for ephemeral builds

---

## 3. Practical Examples

### 3.1 Complete Declarative Jenkinsfile

```groovy
pipeline {
    agent none

    environment {
        APP_NAME    = 'my-app'
        DOCKER_REG  = 'registry.example.com'
        DOCKER_CREDS = credentials('docker-registry-creds')
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }

    parameters {
        string(name: 'BRANCH', defaultValue: 'main', description: 'Branch to build')
        choice(name: 'ENV', choices: ['dev', 'staging', 'prod'], description: 'Deployment environment')
        booleanParam(name: 'RUN_TESTS', defaultValue: true, description: 'Run test suite')
    }

    stages {
        stage('Checkout') {
            agent { label 'linux' }
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                }
            }
        }

        stage('Build') {
            agent { label 'linux' }
            steps {
                sh 'mvn clean package -DskipTests'
                archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
                stash includes: 'target/*.jar', name: 'app-jar'
            }
        }

        stage('Test') {
            when {
                expression { params.RUN_TESTS == true }
            }
            parallel {
                stage('Unit Tests') {
                    agent { label 'linux' }
                    steps {
                        unstash 'app-jar'
                        sh 'mvn test'
                    }
                    post {
                        always {
                            junit 'target/surefire-reports/*.xml'
                        }
                    }
                }
                stage('Integration Tests') {
                    agent { label 'linux && docker' }
                    steps {
                        unstash 'app-jar'
                        sh 'mvn verify -Pintegration-tests'
                    }
                }
            }
        }

        stage('Code Quality') {
            agent { label 'linux' }
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'mvn sonar:sonar'
                }
            }
        }

        stage('Build Docker Image') {
            agent { label 'linux && docker' }
            steps {
                sh """
                    docker build -t ${DOCKER_REG}/${APP_NAME}:${GIT_COMMIT_SHORT} .
                    docker tag ${DOCKER_REG}/${APP_NAME}:${GIT_COMMIT_SHORT} ${DOCKER_REG}/${APP_NAME}:latest
                """
            }
        }

        stage('Push Docker Image') {
            agent { label 'linux && docker' }
            steps {
                sh """
                    echo \$DOCKER_CREDS_PSW | docker login ${DOCKER_REG} -u \$DOCKER_CREDS_USR --password-stdin
                    docker push ${DOCKER_REG}/${APP_NAME}:${GIT_COMMIT_SHORT}
                    docker push ${DOCKER_REG}/${APP_NAME}:latest
                """
            }
        }

        stage('Deploy') {
            agent { label 'linux' }
            when {
                branch 'main'
            }
            input {
                message 'Deploy to production?'
                ok 'Deploy'
                submitter 'admin,deployer'
            }
            steps {
                sh "./deploy.sh ${params.ENV} ${GIT_COMMIT_SHORT}"
            }
        }
    }

    post {
        always {
            node('linux') {
                cleanWs()
            }
        }
        success {
            slackSend channel: '#deployments', color: 'good',
                message: "SUCCESS: ${APP_NAME} ${GIT_COMMIT_SHORT} deployed to ${params.ENV}"
        }
        failure {
            slackSend channel: '#deployments', color: 'danger',
                message: "FAILED: ${APP_NAME} build #${BUILD_NUMBER}"
            mail to: 'devops@example.com',
                subject: "Jenkins Build Failed: ${APP_NAME}",
                body: "Check: ${BUILD_URL}"
        }
    }
}
```

### 3.2 Scripted Pipeline Example

```groovy
node('linux') {
    def appName = 'my-app'
    def dockerImage

    try {
        stage('Checkout') {
            checkout scm
        }

        stage('Build') {
            sh 'mvn clean package -DskipTests'
        }

        stage('Test') {
            try {
                sh 'mvn test'
            } finally {
                junit 'target/surefire-reports/*.xml'
            }
        }

        stage('Docker Build') {
            dockerImage = docker.build("${appName}:${env.BUILD_NUMBER}")
        }

        stage('Docker Push') {
            docker.withRegistry('https://registry.example.com', 'docker-creds') {
                dockerImage.push()
                dockerImage.push('latest')
            }
        }

        stage('Deploy') {
            if (env.BRANCH_NAME == 'main') {
                timeout(time: 10, unit: 'MINUTES') {
                    input message: 'Approve deployment?'
                }
                sh "./deploy.sh production"
            } else {
                echo "Skipping deploy for branch: ${env.BRANCH_NAME}"
            }
        }

        currentBuild.result = 'SUCCESS'
    } catch (Exception e) {
        currentBuild.result = 'FAILURE'
        throw e
    } finally {
        cleanWs()
        if (currentBuild.result == 'FAILURE') {
            mail to: 'team@example.com',
                subject: "Build Failed: ${appName} #${env.BUILD_NUMBER}",
                body: "See ${env.BUILD_URL}"
        }
    }
}
```

### 3.3 Multi-Branch Pipeline

**Configuration in Jenkins UI:**
1. New Item → Multibranch Pipeline
2. Add Branch Source (Git/GitHub/Bitbucket)
3. Configure build strategies and Jenkinsfile path

**Jenkinsfile with branch-specific behavior:**

```groovy
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'npm install && npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Deploy to Dev') {
            when {
                branch 'develop'
            }
            steps {
                sh './deploy.sh dev'
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'release/*'
            }
            steps {
                sh './deploy.sh staging'
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
                beforeInput true
            }
            input {
                message 'Deploy to production?'
                ok 'Yes, deploy!'
            }
            steps {
                sh './deploy.sh production'
            }
        }

        stage('PR Validation') {
            when {
                changeRequest()
            }
            steps {
                sh 'npm run lint'
                sh 'npm run test:coverage'
            }
        }
    }
}
```

### 3.4 Shared Library Example

**vars/standardPipeline.groovy:**

```groovy
def call(Map config = [:]) {
    pipeline {
        agent any

        environment {
            APP_NAME = config.appName ?: 'default-app'
            DEPLOY_ENV = config.deployEnv ?: 'dev'
        }

        stages {
            stage('Checkout') {
                steps {
                    checkout scm
                }
            }

            stage('Build') {
                steps {
                    script {
                        if (config.buildTool == 'maven') {
                            sh 'mvn clean package -DskipTests'
                        } else if (config.buildTool == 'gradle') {
                            sh './gradlew build -x test'
                        } else {
                            sh 'npm install && npm run build'
                        }
                    }
                }
            }

            stage('Test') {
                steps {
                    script {
                        if (config.buildTool == 'maven') {
                            sh 'mvn test'
                            junit 'target/surefire-reports/*.xml'
                        } else {
                            sh 'npm test'
                        }
                    }
                }
            }

            stage('Deploy') {
                when {
                    branch 'main'
                }
                steps {
                    sh "./deploy.sh ${DEPLOY_ENV}"
                }
            }
        }

        post {
            failure {
                slackSend channel: config.slackChannel ?: '#builds',
                    message: "FAILED: ${APP_NAME} #${BUILD_NUMBER}"
            }
        }
    }
}
```

**Consumer Jenkinsfile:**

```groovy
@Library('my-shared-library') _

standardPipeline(
    appName: 'user-service',
    buildTool: 'maven',
    deployEnv: 'staging',
    slackChannel: '#team-platform'
)
```

### 3.5 Docker Agent in Pipeline

```groovy
pipeline {
    agent none

    stages {
        stage('Build with Maven') {
            agent {
                docker {
                    image 'maven:3.9-eclipse-temurin-21'
                    args '-v $HOME/.m2:/root/.m2'
                }
            }
            steps {
                sh 'mvn clean package'
                stash includes: 'target/*.jar', name: 'jar'
            }
        }

        stage('Build Docker Image') {
            agent { label 'docker' }
            steps {
                unstash 'jar'
                script {
                    def image = docker.build("my-app:${env.BUILD_NUMBER}")
                    docker.withRegistry('https://registry.example.com', 'docker-creds') {
                        image.push()
                    }
                }
            }
        }

        stage('Test with Python') {
            agent {
                docker {
                    image 'python:3.12-slim'
                }
            }
            steps {
                sh '''
                    pip install -r requirements-test.txt
                    pytest tests/ --junitxml=results.xml
                '''
            }
            post {
                always {
                    junit 'results.xml'
                }
            }
        }

        stage('Deploy with Kubectl') {
            agent {
                docker {
                    image 'bitnami/kubectl:latest'
                    args '--entrypoint=""'
                }
            }
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    sh 'kubectl apply -f k8s/'
                }
            }
        }
    }
}
```

### 3.6 Parameterized Pipeline

```groovy
pipeline {
    agent any

    parameters {
        string(name: 'VERSION', defaultValue: '1.0.0', description: 'Release version')
        choice(name: 'ENVIRONMENT', choices: ['dev', 'qa', 'staging', 'prod'], description: 'Target environment')
        booleanParam(name: 'SKIP_TESTS', defaultValue: false, description: 'Skip test execution')
        text(name: 'RELEASE_NOTES', defaultValue: '', description: 'Release notes for this version')
        password(name: 'API_KEY', defaultValue: '', description: 'API key for deployment')
    }

    environment {
        APP_VERSION = "${params.VERSION}-${BUILD_NUMBER}"
    }

    stages {
        stage('Info') {
            steps {
                echo "Deploying version ${APP_VERSION} to ${params.ENVIRONMENT}"
                echo "Release Notes: ${params.RELEASE_NOTES}"
            }
        }

        stage('Build') {
            steps {
                sh "mvn clean package -Dversion=${APP_VERSION}"
            }
        }

        stage('Test') {
            when {
                expression { !params.SKIP_TESTS }
            }
            steps {
                sh 'mvn test'
            }
        }

        stage('Deploy') {
            when {
                expression { params.ENVIRONMENT != 'prod' || env.BRANCH_NAME == 'main' }
            }
            steps {
                sh """
                    ./deploy.sh \
                        --env ${params.ENVIRONMENT} \
                        --version ${APP_VERSION}
                """
            }
        }

        stage('Production Approval') {
            when {
                expression { params.ENVIRONMENT == 'prod' }
            }
            input {
                message "Deploy ${APP_VERSION} to PRODUCTION?"
                ok 'Approve'
                submitter 'admin,release-manager'
                parameters {
                    string(name: 'CONFIRM', defaultValue: '', description: 'Type CONFIRM to proceed')
                }
            }
            steps {
                script {
                    if (CONFIRM != 'CONFIRM') {
                        error('Deployment not confirmed')
                    }
                }
                sh "./deploy.sh --env prod --version ${APP_VERSION}"
            }
        }
    }
}
```

---

## 4. Cheat Sheet

### Jenkins Pipeline Syntax

| Element | Syntax | Description |
|---------|--------|-------------|
| `pipeline` | `pipeline { }` | Top-level block for declarative pipeline |
| `agent` | `agent any / none / { label 'x' }` | Where to run the pipeline |
| `stages` | `stages { stage('X') { } }` | Container for stages |
| `steps` | `steps { sh 'cmd' }` | Actual build steps |
| `post` | `post { always { } }` | Post-build actions |
| `environment` | `environment { KEY = 'val' }` | Set environment variables |
| `parameters` | `parameters { string(...) }` | Build parameters |
| `triggers` | `triggers { cron('...') }` | Build triggers |
| `options` | `options { timeout(...) }` | Pipeline options |
| `when` | `when { branch 'main' }` | Conditional execution |
| `parallel` | `parallel { stage('A') {} }` | Run stages in parallel |
| `input` | `input { message '...' }` | Manual approval gate |
| `tools` | `tools { maven 'M3' }` | Auto-install tools |
| `libraries` | `@Library('lib') _` | Import shared library |

### Common Steps

| Step | Usage | Description |
|------|-------|-------------|
| `sh` | `sh 'command'` | Run shell command (Linux/macOS) |
| `bat` | `bat 'command'` | Run batch command (Windows) |
| `powershell` | `powershell 'cmd'` | Run PowerShell command |
| `echo` | `echo 'message'` | Print message |
| `checkout` | `checkout scm` | Checkout source code |
| `git` | `git url: '...'` | Clone git repo |
| `stash` | `stash includes: '**', name: 'x'` | Stash files for later |
| `unstash` | `unstash 'x'` | Retrieve stashed files |
| `archiveArtifacts` | `archiveArtifacts '*.jar'` | Archive build artifacts |
| `junit` | `junit '**/*.xml'` | Publish JUnit results |
| `mail` | `mail to: '...', subject: '...'` | Send email |
| `slackSend` | `slackSend message: '...'` | Send Slack notification |
| `withCredentials` | `withCredentials([...]) { }` | Bind credentials |
| `timeout` | `timeout(time: 10, unit: 'MINUTES')` | Set timeout |
| `retry` | `retry(3) { }` | Retry on failure |
| `sleep` | `sleep time: 5, unit: 'SECONDS'` | Pause execution |
| `error` | `error 'message'` | Fail the build |
| `input` | `input 'Continue?'` | Wait for human input |
| `cleanWs` | `cleanWs()` | Clean workspace |
| `readFile` | `readFile 'file.txt'` | Read a file |
| `writeFile` | `writeFile file: 'f', text: 't'` | Write a file |

### Jenkins CLI Commands

| Command | Description |
|---------|-------------|
| `java -jar jenkins-cli.jar -s URL help` | List available CLI commands |
| `java -jar jenkins-cli.jar -s URL build JOB` | Trigger a build |
| `java -jar jenkins-cli.jar -s URL console JOB` | View console output |
| `java -jar jenkins-cli.jar -s URL list-jobs` | List all jobs |
| `java -jar jenkins-cli.jar -s URL install-plugin PLUGIN` | Install a plugin |
| `java -jar jenkins-cli.jar -s URL safe-restart` | Restart Jenkins safely |
| `java -jar jenkins-cli.jar -s URL reload-configuration` | Reload config from disk |
| `java -jar jenkins-cli.jar -s URL who-am-i` | Show current user |

### Groovy Syntax Quick Reference

| Syntax | Example | Description |
|--------|---------|-------------|
| Variable | `def x = 'hello'` | Declare variable |
| String interpolation | `"Hello ${name}"` | GString interpolation |
| List | `def list = [1, 2, 3]` | Create list |
| Map | `def map = [key: 'val']` | Create map |
| Closure | `{ arg -> println arg }` | Anonymous function |
| Conditional | `if (x) { } else { }` | If-else |
| Loop | `items.each { println it }` | Iterate collection |
| Try-catch | `try { } catch (e) { }` | Error handling |
| Null-safe | `obj?.method()` | Null-safe operator |
| Elvis | `x ?: 'default'` | Elvis operator |

### Important Jenkins File Paths

| Path | Description |
|------|-------------|
| `$JENKINS_HOME` | Jenkins installation directory |
| `$JENKINS_HOME/config.xml` | Global configuration |
| `$JENKINS_HOME/jobs/` | Job configurations |
| `$JENKINS_HOME/plugins/` | Installed plugins |
| `$JENKINS_HOME/credentials.xml` | Credential store |
| `$JENKINS_HOME/secrets/` | Encryption keys |
| `$JENKINS_HOME/users/` | User accounts |
| `$JENKINS_HOME/workspace/` | Build workspaces |
| `$JENKINS_HOME/logs/` | Jenkins logs |

---

## 5. Hands-on Labs

### Lab 1: Create a Declarative Pipeline with Multiple Stages

**Objective:** Build a pipeline with Build, Test, Code Analysis, and Deploy stages.

**Steps:**

1. **Create a New Pipeline Job:**
   - Jenkins Dashboard → New Item → Pipeline → Name: `multi-stage-demo`

2. **Configure Pipeline Script:**
   ```groovy
   pipeline {
       agent any
   
       environment {
           APP = 'lab1-app'
       }
   
       options {
           timestamps()
           timeout(time: 15, unit: 'MINUTES')
       }
   
       stages {
           stage('Checkout') {
               steps {
                   echo "Checking out source code..."
                   // checkout scm  // Uncomment for real SCM
                   sh 'echo "Source code checked out"'
               }
           }
   
           stage('Build') {
               steps {
                   echo "Building ${APP}..."
                   sh '''
                       mkdir -p target
                       echo "build artifact" > target/app.jar
                   '''
                   archiveArtifacts artifacts: 'target/*.jar'
               }
           }
   
           stage('Test') {
               parallel {
                   stage('Unit Tests') {
                       steps {
                           echo 'Running unit tests...'
                           sh 'echo "Unit tests passed"'
                       }
                   }
                   stage('Integration Tests') {
                       steps {
                           echo 'Running integration tests...'
                           sh 'echo "Integration tests passed"'
                       }
                   }
               }
           }
   
           stage('Code Quality') {
               steps {
                   echo 'Running static analysis...'
                   sh 'echo "Code quality: PASSED"'
               }
           }
   
           stage('Deploy') {
               when {
                   branch 'main'
               }
               steps {
                   echo "Deploying ${APP}..."
                   sh 'echo "Deployed successfully"'
               }
           }
       }
   
       post {
           success {
               echo 'Pipeline completed successfully!'
           }
           failure {
               echo 'Pipeline failed!'
           }
           always {
               cleanWs()
           }
       }
   }
   ```

3. **Run and Observe:**
   - Click "Build Now"
   - View the Stage View for visual representation
   - Check Console Output for each stage
   - Verify artifacts are archived

**Key Takeaways:**
- Declarative syntax structure
- Parallel stage execution
- Post actions for cleanup
- Conditional deployment with `when`

---

### Lab 2: Set Up Multi-Branch Pipeline

**Objective:** Configure Jenkins to automatically discover and build branches.

**Prerequisites:** A Git repository with a Jenkinsfile in the root.

**Steps:**

1. **Prepare Repository Structure:**
   ```
   my-repo/
   ├── Jenkinsfile
   ├── src/
   │   └── app.py
   └── tests/
       └── test_app.py
   ```

2. **Create Jenkinsfile:**
   ```groovy
   pipeline {
       agent any
   
       stages {
           stage('Build') {
               steps {
                   echo "Building on branch: ${env.BRANCH_NAME}"
                   sh 'echo "Build complete"'
               }
           }
   
           stage('Test') {
               steps {
                   sh 'echo "Tests passed on ${BRANCH_NAME}"'
               }
           }
   
           stage('Deploy to Dev') {
               when { branch 'develop' }
               steps {
                   echo 'Deploying to Dev environment...'
               }
           }
   
           stage('Deploy to Staging') {
               when { branch pattern: 'release/.*', comparator: 'REGEXP' }
               steps {
                   echo 'Deploying to Staging environment...'
               }
           }
   
           stage('Deploy to Prod') {
               when {
                   branch 'main'
                   beforeInput true
               }
               input {
                   message 'Approve Production Deployment?'
                   ok 'Deploy'
               }
               steps {
                   echo 'Deploying to Production...'
               }
           }
       }
   }
   ```

3. **Configure in Jenkins:**
   - New Item → Multibranch Pipeline → Name: `multi-branch-demo`
   - Branch Sources → Add Source → Git
   - Enter repository URL and credentials
   - Build Configuration: Jenkinsfile path = `Jenkinsfile`
   - Scan Multibranch Pipeline Triggers: Interval = 1 minute (for demo)

4. **Test:**
   - Push to `develop` → should deploy to Dev
   - Create `release/1.0` branch → should deploy to Staging
   - Push to `main` → should prompt for production approval

**Key Takeaways:**
- Automatic branch discovery
- Branch-specific deployment logic
- PRs can be validated automatically
- Jenkinsfile in SCM = Pipeline as Code

---

### Lab 3: Create a Shared Library

**Objective:** Build a reusable shared library and consume it in pipelines.

**Steps:**

1. **Create Shared Library Repository:**
   ```
   jenkins-shared-lib/
   ├── vars/
   │   ├── buildApp.groovy
   │   ├── deployApp.groovy
   │   └── notifySlack.groovy
   └── src/
       └── com/
           └── company/
               └── DockerHelper.groovy
   ```

2. **vars/buildApp.groovy:**
   ```groovy
   def call(String buildTool = 'maven') {
       echo "Building application with ${buildTool}..."
       switch(buildTool) {
           case 'maven':
               sh 'mvn clean package -DskipTests'
               break
           case 'gradle':
               sh './gradlew build -x test'
               break
           case 'npm':
               sh 'npm install && npm run build'
               break
           default:
               error "Unknown build tool: ${buildTool}"
       }
   }
   ```

3. **vars/deployApp.groovy:**
   ```groovy
   def call(Map config) {
       echo "Deploying ${config.app} to ${config.env}..."
       if (config.env == 'prod') {
           input message: "Approve deployment to production?"
       }
       sh """
           echo "Deploying to ${config.env}"
           # ./deploy.sh --app ${config.app} --env ${config.env} --version ${config.version}
       """
   }
   ```

4. **vars/notifySlack.groovy:**
   ```groovy
   def call(String status, String channel = '#builds') {
       def color = status == 'SUCCESS' ? 'good' : 'danger'
       echo "Slack notification: [${status}] to ${channel} (color: ${color})"
       // slackSend channel: channel, color: color,
       //     message: "${status}: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)"
   }
   ```

5. **Register Library in Jenkins:**
   - Manage Jenkins → Configure System → Global Pipeline Libraries
   - Name: `my-shared-lib`
   - Default Version: `main`
   - Source: Git → URL of shared lib repo

6. **Consume in Jenkinsfile:**
   ```groovy
   @Library('my-shared-lib') _
   
   pipeline {
       agent any
       stages {
           stage('Build') {
               steps {
                   buildApp('maven')
               }
           }
           stage('Deploy') {
               steps {
                   deployApp(app: 'myservice', env: 'staging', version: '1.2.3')
               }
           }
       }
       post {
           success { notifySlack('SUCCESS') }
           failure { notifySlack('FAILURE') }
       }
   }
   ```

**Key Takeaways:**
- Shared libraries promote DRY pipelines
- `vars/` = global functions, `src/` = classes
- Versioned via Git branches/tags
- Centralized pipeline logic updates

---

### Lab 4: Pipeline with Docker Agent

**Objective:** Use Docker containers as build agents for isolated, reproducible builds.

**Prerequisites:** Docker installed on Jenkins agent, Docker Pipeline plugin.

**Steps:**

1. **Create Jenkinsfile:**
   ```groovy
   pipeline {
       agent none
   
       stages {
           stage('Build Java App') {
               agent {
                   docker {
                       image 'maven:3.9-eclipse-temurin-21'
                       args '-v maven-repo:/root/.m2'
                   }
               }
               steps {
                   sh 'mvn --version'
                   sh 'echo "Building with Maven in Docker..."'
                   // sh 'mvn clean package'
               }
           }
   
           stage('Run Tests in Node') {
               agent {
                   docker {
                       image 'node:20-alpine'
                   }
               }
               steps {
                   sh 'node --version'
                   sh 'npm --version'
                   sh 'echo "Running Node.js tests..."'
               }
           }
   
           stage('Build with Custom Dockerfile') {
               agent {
                   dockerfile {
                       filename 'Dockerfile.build'
                       dir 'docker'
                       additionalBuildArgs '--build-arg VERSION=1.0'
                       args '-v /tmp:/tmp'
                   }
               }
               steps {
                   sh 'echo "Building with custom Dockerfile..."'
               }
           }
   
           stage('Security Scan') {
               agent {
                   docker {
                       image 'aquasec/trivy:latest'
                       args '--entrypoint=""'
                   }
               }
               steps {
                   sh 'trivy --version'
                   sh 'echo "Running security scan..."'
               }
           }
   
           stage('Build & Push Image') {
               agent { label 'docker' }
               steps {
                   script {
                       def app = docker.build("my-app:${env.BUILD_NUMBER}")
                       docker.withRegistry('https://registry.example.com', 'docker-creds') {
                           app.push()
                           app.push('latest')
                       }
                   }
               }
           }
       }
   }
   ```

2. **Create docker/Dockerfile.build:**
   ```dockerfile
   FROM ubuntu:22.04
   ARG VERSION
   RUN apt-get update && apt-get install -y curl git
   ENV APP_VERSION=${VERSION}
   ```

3. **Run and Verify:**
   - Each stage spins up its own Docker container
   - No tool installation needed on the Jenkins agent
   - Containers are destroyed after each stage

**Key Takeaways:**
- Docker agents provide isolated, reproducible environments
- Different tools per stage without polluting the agent
- `docker { }` for pre-built images, `dockerfile { }` for custom
- Use `args` for volume mounts and container configuration

---

## 6. Real-world Scenarios

### Scenario 1: Migrate from Freestyle to Pipeline Jobs

**Context:** Your organization has 50+ freestyle jobs with manual configuration. Maintenance is painful, and there's no version control for job definitions.

**Migration Strategy:**

1. **Audit Existing Freestyle Jobs:**
   - Document each job's build steps, triggers, post-build actions
   - Identify common patterns across jobs
   - Map plugins used to pipeline equivalents

2. **Create a Migration Template:**
   ```groovy
   // Template mapping for freestyle → pipeline
   // Build Step: "Execute shell" → sh 'command'
   // Build Step: "Invoke Maven" → sh 'mvn goals' or tools { maven 'M3' }
   // Post-build: "Publish JUnit" → junit 'path'
   // Post-build: "Archive artifacts" → archiveArtifacts 'path'
   // Post-build: "Email notification" → mail to: '...', subject: '...'
   // Trigger: "Poll SCM" → triggers { pollSCM('...') }
   // Trigger: "Build periodically" → triggers { cron('...') }
   ```

3. **Phase 1 — Convert Common Jobs:**
   ```groovy
   // Before: Freestyle job with manual config
   // After: Declarative pipeline
   pipeline {
       agent { label 'linux' }
   
       triggers {
           pollSCM('H/5 * * * *')  // Was: SCM polling in freestyle config
       }
   
       tools {
           maven 'Maven-3.9'       // Was: Build Environment → Maven
           jdk 'JDK-21'            // Was: Build Environment → JDK
       }
   
       stages {
           stage('Build') {
               steps {
                   sh 'mvn clean package'  // Was: Build → Invoke Maven
               }
           }
           stage('Test') {
               steps {
                   sh 'mvn test'
               }
               post {
                   always {
                       junit '**/surefire-reports/*.xml'  // Was: Post-build → JUnit
                   }
               }
           }
       }
   
       post {
           success {
               archiveArtifacts 'target/*.jar'   // Was: Post-build → Archive
           }
           failure {
               mail to: 'team@example.com',      // Was: Post-build → Email
                   subject: "Failed: ${JOB_NAME}",
                   body: "See: ${BUILD_URL}"
           }
       }
   }
   ```

4. **Phase 2 — Create Shared Libraries:**
   - Extract common patterns into shared library functions
   - Standardize build → test → deploy workflow

5. **Phase 3 — Implement Multi-Branch:**
   - Convert single-branch pipelines to multi-branch
   - Set up branch discovery and PR validation

6. **Phase 4 — Deprecate Freestyle:**
   - Run pipelines in parallel with freestyle for validation
   - Disable and archive freestyle jobs once confirmed

**Benefits Achieved:**
- Pipeline definitions in version control
- Code review for pipeline changes
- Reusable shared libraries
- Automatic branch and PR handling
- Easier debugging and maintenance

---

### Scenario 2: Jenkins Pipeline for Kubernetes Deployment

**Context:** Deploy a microservices application to Kubernetes with rolling updates, canary deployments, and automated rollback.

**Architecture:**
```
Jenkins → Docker Build → Push to Registry → Deploy to K8s
                                              ├── Dev Cluster
                                              ├── Staging Cluster
                                              └── Prod Cluster (canary → full)
```

**Jenkinsfile:**

```groovy
pipeline {
    agent { label 'kubernetes' }

    environment {
        REGISTRY     = 'registry.example.com'
        APP_NAME     = 'order-service'
        K8S_NS       = 'microservices'
        DOCKER_CREDS = credentials('docker-registry')
        KUBECONFIG_DEV  = credentials('kubeconfig-dev')
        KUBECONFIG_PROD = credentials('kubeconfig-prod')
    }

    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['dev', 'staging', 'prod'], description: 'Target')
        booleanParam(name: 'CANARY', defaultValue: true, description: 'Canary deploy (prod only)')
        string(name: 'CANARY_WEIGHT', defaultValue: '10', description: 'Canary traffic %')
    }

    stages {
        stage('Build & Test') {
            agent {
                docker { image 'maven:3.9-eclipse-temurin-21' }
            }
            steps {
                sh 'mvn clean verify'
                junit '**/surefire-reports/*.xml'
                stash includes: 'target/*.jar,Dockerfile,k8s/**', name: 'build'
            }
        }

        stage('Docker Build & Push') {
            steps {
                unstash 'build'
                script {
                    def tag = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
                    env.IMAGE_TAG = tag
                    sh """
                        docker build -t ${REGISTRY}/${APP_NAME}:${tag} .
                        echo \$DOCKER_CREDS_PSW | docker login ${REGISTRY} -u \$DOCKER_CREDS_USR --password-stdin
                        docker push ${REGISTRY}/${APP_NAME}:${tag}
                    """
                }
            }
        }

        stage('Deploy to Dev') {
            when { expression { params.DEPLOY_ENV == 'dev' } }
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-dev', variable: 'KUBECONFIG')]) {
                    sh """
                        kubectl set image deployment/${APP_NAME} \
                            ${APP_NAME}=${REGISTRY}/${APP_NAME}:${IMAGE_TAG} \
                            -n ${K8S_NS} --record
                        kubectl rollout status deployment/${APP_NAME} -n ${K8S_NS} --timeout=300s
                    """
                }
            }
        }

        stage('Deploy to Production') {
            when { expression { params.DEPLOY_ENV == 'prod' } }
            stages {
                stage('Canary Deploy') {
                    when { expression { params.CANARY } }
                    steps {
                        withCredentials([file(credentialsId: 'kubeconfig-prod', variable: 'KUBECONFIG')]) {
                            sh """
                                kubectl apply -f k8s/canary-deployment.yaml \
                                    --set image=${REGISTRY}/${APP_NAME}:${IMAGE_TAG}
                                kubectl set image deployment/${APP_NAME}-canary \
                                    ${APP_NAME}=${REGISTRY}/${APP_NAME}:${IMAGE_TAG} \
                                    -n ${K8S_NS}
                            """
                        }
                    }
                }

                stage('Canary Validation') {
                    when { expression { params.CANARY } }
                    steps {
                        sh '''
                            echo "Monitoring canary for 5 minutes..."
                            # Check error rates, latency, etc.
                            # ./scripts/canary-validation.sh
                        '''
                        input message: 'Canary looks good. Promote to full rollout?', ok: 'Promote'
                    }
                }

                stage('Full Rollout') {
                    steps {
                        withCredentials([file(credentialsId: 'kubeconfig-prod', variable: 'KUBECONFIG')]) {
                            sh """
                                kubectl set image deployment/${APP_NAME} \
                                    ${APP_NAME}=${REGISTRY}/${APP_NAME}:${IMAGE_TAG} \
                                    -n ${K8S_NS} --record
                                kubectl rollout status deployment/${APP_NAME} -n ${K8S_NS} --timeout=600s
                            """
                        }
                    }
                }
            }
        }
    }

    post {
        failure {
            script {
                if (params.DEPLOY_ENV == 'prod') {
                    withCredentials([file(credentialsId: 'kubeconfig-prod', variable: 'KUBECONFIG')]) {
                        sh "kubectl rollout undo deployment/${APP_NAME} -n ${K8S_NS}"
                    }
                    slackSend channel: '#incidents', color: 'danger',
                        message: "ROLLBACK: ${APP_NAME} deployment failed and was rolled back"
                }
            }
        }
        success {
            slackSend channel: '#deployments', color: 'good',
                message: "DEPLOYED: ${APP_NAME}:${IMAGE_TAG} → ${params.DEPLOY_ENV}"
        }
    }
}
```

**Key Patterns:**
- Canary deployment with manual promotion gate
- Automatic rollback on failure
- Environment-specific kubeconfig credentials
- Build once, deploy many (stash/unstash)
- Image tag includes build number and git commit

---

## 7. Interview Q&A

### Basic (Q1–Q15)

**Q1. What is Jenkins?**

> Jenkins is an open-source automation server written in Java that facilitates Continuous Integration and Continuous Delivery (CI/CD). It automates building, testing, and deploying software, allowing developers to integrate code changes frequently and detect issues early.

**Q2. What is Continuous Integration (CI) and how does Jenkins support it?**

> CI is the practice of merging developer code changes into a shared repository frequently, with automated builds and tests triggered on each merge. Jenkins supports CI by automatically detecting code changes (via polling or webhooks), running builds and tests, and reporting results back to the team.

**Q3. What is the difference between Jenkins Freestyle and Pipeline jobs?**

> Freestyle jobs are configured through the Jenkins UI with a fixed set of build steps and limited flexibility. Pipeline jobs are defined as code in a Jenkinsfile, support complex workflows with stages, parallel execution, and conditional logic, and can be version-controlled alongside application code.

**Q4. What is a Jenkinsfile?**

> A Jenkinsfile is a text file that defines a Jenkins Pipeline. It is written in Groovy and checked into the project's source control repository, enabling Pipeline-as-Code. It can be either Declarative (structured) or Scripted (full Groovy flexibility).

**Q5. What is the difference between Declarative and Scripted Pipeline?**

> Declarative Pipeline uses a structured syntax starting with `pipeline { }`, is easier to read and write, has built-in validation, and supports `post` blocks. Scripted Pipeline starts with `node { }`, is a full Groovy DSL, offers greater flexibility but is harder to maintain, and uses `try/catch` for error handling.

**Q6. What are Jenkins agents (slaves)?**

> Agents are machines that execute build jobs dispatched by the Jenkins controller. They offload work from the controller and can run on different operating systems. Agents connect via SSH, JNLP, or as Kubernetes pods. Labels are used to direct jobs to specific agent types.

**Q7. What is the Jenkins controller (master)?**

> The Jenkins controller is the central server that manages the Jenkins environment. It hosts the web UI, stores all configuration, schedules jobs, dispatches builds to agents, monitors agent status, and records build results. It should ideally not run builds itself in production.

**Q8. How do you install Jenkins?**

> Jenkins can be installed via: (1) native OS packages (`apt`, `yum`, `brew`), (2) Docker container (`docker run -p 8080:8080 jenkins/jenkins:lts`), (3) WAR file on any Java-capable server (`java -jar jenkins.war`), (4) Kubernetes Helm chart, or (5) cloud marketplace images (AWS, Azure, GCP).

**Q9. What are Jenkins plugins?**

> Plugins extend Jenkins functionality. They integrate Jenkins with SCM tools (Git, GitHub), build tools (Maven, Gradle), notification services (Slack, Email), cloud providers (AWS, Azure), container platforms (Docker, Kubernetes), and more. Jenkins has over 1,800 plugins available.

**Q10. What is the Jenkins Blue Ocean?**

> Blue Ocean is a modern UI plugin for Jenkins that provides a visual pipeline editor, intuitive pipeline visualization, native Git integration, and PR-aware dashboards. It simplifies creating and monitoring pipelines compared to the classic Jenkins UI.

**Q11. What are build triggers in Jenkins?**

> Build triggers determine when a job runs. Common triggers include: SCM polling (checking for changes periodically), webhooks (push-based notification from SCM), cron schedules (time-based), upstream job completion, and manual triggering. Webhooks are preferred over polling for efficiency.

**Q12. What is the workspace in Jenkins?**

> The workspace is a directory on the agent's filesystem where Jenkins checks out source code and performs build steps. Each job has its own workspace. Workspaces can be cleaned using `cleanWs()` step or the "Delete workspace before build starts" option.

**Q13. How do you pass parameters to a Jenkins build?**

> Parameters are defined in the `parameters` block of a Declarative Pipeline. Types include `string`, `choice`, `booleanParam`, `password`, `text`, and `file`. Parameters are accessed via `params.PARAM_NAME` in the pipeline.

**Q14. What is the purpose of the `post` section in a Declarative Pipeline?**

> The `post` section defines actions to run after stages complete, based on the build outcome. Conditions include `always` (runs regardless), `success`, `failure`, `unstable`, `changed` (status changed from last build), and `aborted`. Common uses are notifications, cleanup, and artifact archiving.

**Q15. What is Jenkins Home directory?**

> Jenkins Home (`JENKINS_HOME`) is the root directory where Jenkins stores all configuration, job definitions, build history, plugin data, credentials, and logs. Default location is `~/.jenkins` or `/var/lib/jenkins`. It should be backed up regularly and ideally stored on reliable storage.

---

### Intermediate (Q16–Q35)

**Q16. Explain Jenkins Pipeline stages, steps, and post actions.**

> **Stages** are logical divisions of a pipeline (e.g., Build, Test, Deploy). **Steps** are individual tasks within a stage (e.g., `sh 'mvn test'`, `echo 'done'`). **Post actions** execute after stages complete, conditioned on build status (`always`, `success`, `failure`, etc.). Together, they form the structural building blocks of a pipeline.

**Q17. How do parallel stages work in Jenkins Pipeline?**

> Parallel stages run simultaneously to reduce overall pipeline time. They are defined within a `parallel` block inside a `stage`. Each parallel branch is itself a stage with its own agent and steps. Failure in one parallel branch can optionally fail the entire pipeline via `failFast true`.

**Q18. What are Shared Libraries in Jenkins?**

> Shared Libraries are reusable Groovy code stored in a separate Git repository and imported into Jenkinsfiles using `@Library('name') _`. They contain global functions (`vars/`), classes (`src/`), and resources (`resources/`). They promote DRY principles and standardize pipeline logic across projects.

**Q19. How does credential management work in Jenkins?**

> Jenkins provides a built-in credential store for secrets. Credentials can be scoped globally, to a system, or to a folder. Types include username/password, SSH keys, secret text, secret files, and certificates. In pipelines, credentials are accessed via `credentials()` helper or `withCredentials` block, which injects them as environment variables.

**Q20. What is the `when` directive in Declarative Pipeline?**

> The `when` directive controls whether a stage executes based on conditions. Common conditions include `branch 'main'` (branch name), `environment name: 'X', value: 'Y'`, `expression { return true }` (Groovy expression), `changeset '**/*.java'` (files changed), `tag pattern: 'v*'`, and `changeRequest()` (PR builds).

**Q21. How do you implement manual approval gates in Jenkins?**

> Use the `input` step or directive. In Declarative Pipeline, `input` can be a stage-level directive or a step. It pauses the pipeline until a user approves. You can specify `message`, `ok` button text, `submitter` (authorized users), and additional `parameters`. Combine with `timeout` to auto-reject after a period.

**Q22. What are Jenkins environment variables?**

> Jenkins provides built-in environment variables (`BUILD_NUMBER`, `JOB_NAME`, `WORKSPACE`, `GIT_COMMIT`, `BRANCH_NAME`, `BUILD_URL`) and allows custom ones via the `environment` block. The `credentials()` helper creates bound environment variables from stored credentials. Variables can be set globally or per-stage.

**Q23. How does Jenkins integrate with Docker?**

> Jenkins integrates with Docker via the Docker Pipeline plugin. Pipelines can: (1) use Docker images as agents (`agent { docker { image '...' } }`), (2) build Docker images (`docker.build()`), (3) push to registries (`docker.withRegistry()`), (4) run containers as build environments, and (5) use custom Dockerfiles (`agent { dockerfile { } }`).

**Q24. Explain Jenkins Multibranch Pipeline.**

> Multibranch Pipeline automatically discovers branches in a repository and creates pipeline jobs for each branch containing a Jenkinsfile. It supports branch-specific pipeline behavior via `when { branch '...' }` conditions, automatically builds PRs, and cleans up jobs for deleted branches. It's configured with Branch Sources (Git, GitHub, etc.).

**Q25. What are Jenkins Pipeline options?**

> Options configure pipeline-wide settings: `timeout(time: 30, unit: 'MINUTES')` (max duration), `retry(3)` (retry on failure), `disableConcurrentBuilds()` (prevent parallel runs), `buildDiscarder(logRotator(...))` (history retention), `timestamps()` (add timestamps to console), `skipDefaultCheckout()` (disable auto-checkout), `ansiColor('xterm')` (colored output).

**Q26. How do you handle artifacts in Jenkins?**

> Artifacts are preserved using `archiveArtifacts artifacts: 'pattern', fingerprint: true`. For passing artifacts between stages, use `stash/unstash`. For external artifact repositories, use plugins like Nexus Artifact Uploader or Artifactory. Artifact retention is controlled via `buildDiscarder` option.

**Q27. What is Jenkins Configuration as Code (JCasC)?**

> JCasC allows defining the entire Jenkins configuration in YAML files instead of the UI. It covers system settings, security, credentials, plugin config, and job definitions. The `configuration-as-code` plugin reads YAML from a file or URL at startup, enabling reproducible Jenkins setups and GitOps workflows.

**Q28. How do you secure Jenkins?**

> Security measures include: (1) enable authentication (LDAP, Active Directory, SAML), (2) use Role-Based Access Control (RBAC) plugin, (3) enable CSRF protection, (4) use HTTPS, (5) run controller on a separate machine from agents, (6) limit Script Console access, (7) use credential binding instead of hardcoding secrets, (8) keep plugins updated, (9) restrict agent-to-controller access, (10) use Folder-based authorization.

**Q29. What is the difference between `sh` and `bat` steps?**

> `sh` executes shell commands on Linux/macOS agents, while `bat` executes batch commands on Windows agents. There's also `powershell` for PowerShell commands on Windows. The appropriate step depends on the agent OS. Scripted pipelines can use `isUnix()` to conditionally choose between them.

**Q30. How do you set up webhooks with Jenkins?**

> For GitHub: (1) install GitHub plugin, (2) configure GitHub Server in Jenkins global settings, (3) add webhook URL (`http://jenkins-url/github-webhook/`) in GitHub repo settings, (4) enable "GitHub hook trigger for GITScm polling" in the job. For GitLab/Bitbucket, similar plugins and webhook configurations exist. Webhooks eliminate the need for polling.

**Q31. What is the Jenkins Script Console?**

> The Script Console (Manage Jenkins → Script Console) allows executing Groovy scripts directly on the Jenkins controller. It's used for administration tasks like bulk job modifications, querying system state, and debugging. It has full access to Jenkins internals and should be restricted to administrators due to security implications.

**Q32. How do you back up Jenkins?**

> Back up the `JENKINS_HOME` directory, which contains all configuration, jobs, plugins, and build history. Use thin backup plugin for scheduled backups, or file-system level snapshots. Critical files: `config.xml`, `credentials.xml`, `jobs/*/config.xml`, `plugins/`, `secrets/`, `users/`. Automate backups with cron or pipeline.

**Q33. What is the `tools` directive in Pipeline?**

> The `tools` directive auto-installs and adds specified tools to the PATH. Common tools: `maven 'Maven-3.9'`, `jdk 'JDK-21'`, `gradle 'Gradle-8'`, `nodejs 'Node-20'`. Tools must be configured in Manage Jenkins → Global Tool Configuration. This eliminates manual tool installation on agents.

**Q34. How do you debug a failing Jenkins pipeline?**

> Debugging approaches: (1) check Console Output for error messages, (2) use `echo` statements for variable inspection, (3) use Replay feature to modify and re-run pipeline without committing, (4) use Pipeline Syntax generator for correct step syntax, (5) check `$JENKINS_HOME/logs` for controller logs, (6) use `catchError` or `try/catch` to handle and log exceptions, (7) use `sh 'env'` to dump environment variables.

**Q35. What is the difference between `agent any`, `agent none`, and `agent { label '...' }`?**

> `agent any` runs on any available agent and allocates a single agent for the entire pipeline. `agent none` doesn't allocate a global agent — each stage must specify its own agent, which is useful for multi-platform builds or resource optimization. `agent { label 'x' }` runs on an agent matching the specified label, e.g., `agent { label 'linux && docker' }`.

---

### Advanced (Q36–Q50)

**Q36. How do you implement a CI/CD pipeline for microservices with Jenkins?**

> Use a Multibranch Pipeline per microservice with a shared library for common logic. The shared library defines standard stages (build, test, scan, deploy). Each microservice's Jenkinsfile imports the library and provides service-specific configuration. Deploy to Kubernetes using `kubectl` or Helm. Implement canary or blue-green deployments with traffic shifting. Use a monorepo approach with path-based triggers, or polyrepo with webhooks per service.

**Q37. How does Jenkins scale in large organizations?**

> Scaling strategies: (1) **Distributed builds** with multiple agents across machines, (2) **Cloud agents** that auto-provision on AWS/Azure/GCP, (3) **Kubernetes plugin** for ephemeral pod agents, (4) **Jenkins controller HA** using active/passive or CloudBees HA, (5) **Folder organization** and RBAC for multi-team management, (6) **Shared libraries** for consistency, (7) **External artifact storage** (Nexus/Artifactory), (8) **Reduce controller load** by never running builds on the controller.

**Q38. Explain the Jenkins Kubernetes plugin and dynamic agents.**

> The Kubernetes plugin dynamically provisions Jenkins agents as Kubernetes pods. When a build is triggered, a pod is created with specified containers, the build runs, and the pod is destroyed. Pod templates define container images, resource limits, volumes, and environment variables. This provides auto-scaling, isolation, and efficient resource usage. Configuration is via `agent { kubernetes { yaml '...' } }` or pod templates in Jenkins settings.

**Q39. How do you implement Pipeline-as-Code with GitOps?**

> Jenkinsfile is stored in the application repository (Pipeline-as-Code). Shared libraries are in a separate versioned repository. Jenkins Configuration as Code (JCasC) YAML files define the Jenkins setup. All changes go through pull requests with code review. Multibranch Pipeline auto-discovers branches. Job DSL plugin or JCasC seeder jobs create pipeline jobs from code. Infrastructure changes trigger Jenkins reconfiguration automatically.

**Q40. What are Jenkins Pipeline Groovy sandbox restrictions and how do you handle them?**

> Jenkins runs pipeline Groovy in a CPS-transformed sandbox that restricts method calls for security. Unapproved methods throw `RejectedAccessException`. Solutions: (1) approve the method in Manage Jenkins → In-process Script Approval, (2) move the code to a shared library marked as trusted (runs outside sandbox), (3) use `@NonCPS` annotation for non-CPS-compatible methods, (4) avoid complex Groovy in Jenkinsfile and use pipeline steps instead.

**Q41. How do you implement canary deployments with Jenkins?**

> Steps: (1) Deploy the new version to a small subset of infrastructure (canary), (2) Route a small percentage of traffic to canary (e.g., 10%) using service mesh (Istio) or ingress controller, (3) Monitor error rates, latency, and key metrics via automated checks, (4) Use `input` step for manual validation, (5) If metrics are healthy, gradually increase traffic (25% → 50% → 100%), (6) If issues detected, automatically rollback with `kubectl rollout undo`. Jenkins orchestrates this workflow through pipeline stages.

**Q42. What is the `@NonCPS` annotation in Jenkins Pipeline?**

> `@NonCPS` marks a Groovy method as non-CPS (Continuation Passing Style) transformed. Jenkins pipelines are serialized at each step for durability (so they can survive restarts). Methods annotated `@NonCPS` run without serialization, which is needed for methods using non-serializable objects (iterators, complex Groovy operations). However, `@NonCPS` methods cannot call CPS-transformed pipeline steps like `sh` or `echo`.

**Q43. How do you handle secrets rotation in Jenkins?**

> Strategies: (1) Use external secret managers (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault) via plugins instead of Jenkins built-in credential store, (2) Vault plugin dynamically fetches secrets at runtime — no static storage, (3) Implement credential rotation policies with expiry dates, (4) Use folder-scoped credentials for least privilege, (5) Audit credential usage with the Audit Trail plugin, (6) Rotate `JENKINS_HOME/secrets/master.key` periodically, (7) Automate rotation via pipeline jobs.

**Q44. Explain Jenkins High Availability (HA) strategies.**

> Jenkins OSS doesn't natively support HA. Approaches: (1) **Active/passive failover** with shared storage (NFS/EFS) and a load balancer that routes to the active instance, (2) **CloudBees CI** provides built-in HA with operations center and managed controllers, (3) **Kubernetes deployment** with persistent volume claims and automatic pod rescheduling, (4) **Periodic backups** with automated restoration procedures, (5) **Ephemeral agents** (Kubernetes plugin) so agent loss doesn't impact builds.

**Q45. How do you optimize Jenkins pipeline performance?**

> Optimization techniques: (1) Use `parallel` stages for independent tasks, (2) Use lightweight Docker/Kubernetes agents instead of heavyweight static agents, (3) Cache dependencies (Maven `.m2`, npm `node_modules`) via Docker volumes, (4) Use `agent none` at top level to allocate agents only when needed, (5) Use `stash/unstash` sparingly (they transfer data through the controller), (6) Skip unnecessary stages with `when` conditions, (7) Use incremental builds, (8) Limit build history with `buildDiscarder`, (9) Avoid heavy Groovy computation in the pipeline.

**Q46. What is Jenkins Job DSL and how does it differ from Pipeline?**

> Job DSL is a plugin that uses Groovy scripts to programmatically create and manage Jenkins jobs (including freestyle, pipeline, multibranch). It generates job XML configurations. Pipeline defines the build process itself (what to build and how). They serve different purposes: Job DSL creates/manages jobs, Pipeline defines what jobs do. In practice, they complement each other — Job DSL can create pipeline jobs that reference Jenkinsfiles.

**Q47. How do you implement Blue-Green deployments with Jenkins?**

> Steps: (1) Maintain two identical environments — Blue (current production) and Green (new version), (2) Jenkins pipeline deploys the new version to the Green environment, (3) Run smoke tests and integration tests against Green, (4) Use load balancer or DNS to switch traffic from Blue to Green, (5) Monitor Green — if issues arise, switch traffic back to Blue (instant rollback), (6) After validation, Blue becomes the standby for the next release. Jenkins orchestrates environment provisioning, deployment, testing, and traffic switching.

**Q48. Explain the CPS (Continuation Passing Style) transformation in Jenkins Pipeline.**

> Jenkins Pipeline uses CPS transformation to serialize pipeline execution state, enabling pipelines to survive Jenkins restarts. Every pipeline step is a suspension point — the execution state is saved to disk. After a restart, the pipeline resumes from the last checkpoint. This has implications: (1) all variables must be serializable, (2) standard Groovy iterators don't work (use `@NonCPS`), (3) some Groovy features behave differently, (4) performance overhead for complex scripts. Understanding CPS is crucial for debugging pipeline issues.

**Q49. How do you mitigate common Jenkins security vulnerabilities?**

> (1) **CSRF**: Enable CSRF protection (default since Jenkins 2.x), (2) **XSS**: Keep Jenkins and plugins updated; Jenkins has built-in content security policies, (3) **Credential exposure**: Use `withCredentials` and mask passwords; set `MaskPasswordsBuildWrapper`, (4) **Agent-to-controller access**: Enable Agent → Controller Security in Manage Jenkins, (5) **Script approval**: Review and restrict approved scripts carefully, (6) **Plugin vulnerabilities**: Regularly update plugins; subscribe to Jenkins Security Advisories, (7) **Network**: Use HTTPS, restrict access to Jenkins ports, use reverse proxy, (8) **Least privilege**: Use Matrix Auth or Role Strategy plugin for fine-grained access control.

**Q50. How would you design a Jenkins infrastructure for a large enterprise with hundreds of teams?**

> Architecture: (1) **Operations Center** (CloudBees CI) or multiple Jenkins controllers organized by department/domain, (2) **Kubernetes-based dynamic agents** for elastic scaling, (3) **Shared libraries** managed by a platform team for standardized pipelines, (4) **JCasC** for reproducible controller configuration, (5) **Folder-based organization** with team-scoped credentials and RBAC, (6) **Plugin management** with centralized update center and approved plugin list, (7) **External services**: Vault for secrets, Artifactory for artifacts, SonarQube for code quality, (8) **Monitoring**: Prometheus metrics, Grafana dashboards, alerting on queue depth and build times, (9) **Disaster recovery**: Automated backups, infrastructure-as-code for controller provisioning, (10) **Self-service**: Template catalog for teams to create standardized pipelines with minimal configuration.

---

*Last updated: April 2026*
