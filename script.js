
// File tree structure
const fileTree = {
    name: 'Notes',
    type: 'folder',
    children: [
        {
            name: '01-computer-science-fundamentals',
            type: 'folder',
            children: [
                { name: 'README.md', type: 'file', path: '01-computer-science-fundamentals/README.md' },
                {
                    name: 'algorithms',
                    type: 'folder',
                    children: [
                        { name: 'bfs-notes.md', type: 'file', path: '01-computer-science-fundamentals/algorithms/bfs-notes.md' },
                        { name: 'dfs-notes.md', type: 'file', path: '01-computer-science-fundamentals/algorithms/dfs-notes.md' }
                    ]
                },
                {
                    name: 'design-patterns',
                    type: 'folder',
                    children: [
                        { name: 'SOLID.md', type: 'file', path: '01-computer-science-fundamentals/design-patterns/SOLID.md' }
                    ]
                },
                {
                    name: 'regex',
                    type: 'folder',
                    children: [
                        { name: 'python-re-module.md', type: 'file', path: '01-computer-science-fundamentals/regex/python-re-module.md' },
                        { name: 'regex-101.md', type: 'file', path: '01-computer-science-fundamentals/regex/regex-101.md' }
                    ]
                }
            ]
        },
        {
            name: '02-backend-development',
            type: 'folder',
            children: [
                { name: 'README.md', type: 'file', path: '02-backend-development/README.md' },
                {
                    name: 'api-gateway',
                    type: 'folder',
                    children: [
                        { name: 'Kong_API_Gateway_101.md', type: 'file', path: '02-backend-development/api-gateway/Kong_API_Gateway_101.md' }
                    ]
                },
                {
                    name: 'databases',
                    type: 'folder',
                    children: [
                        { name: 'Database_Design.md', type: 'file', path: '02-backend-development/databases/Database_Design.md' }
                    ]
                },
                {
                    name: 'fastapi',
                    type: 'folder',
                    children: [
                        { name: 'FastAPI_K8s_Deployment.md', type: 'file', path: '02-backend-development/fastapi/FastAPI_K8s_Deployment.md' },
                        { name: 'FastAPI_Middleware.md', type: 'file', path: '02-backend-development/fastapi/FastAPI_Middleware.md' },
                        { name: 'FastAPI_RBAC.md', type: 'file', path: '02-backend-development/fastapi/FastAPI_RBAC.md' }
                    ]
                }
            ]
        },
        {
            name: '03-big-data-engineering',
            type: 'folder',
            children: [
                { name: 'README.md', type: 'file', path: '03-big-data-engineering/README.md' },
                {
                    name: '01-hadoop-and-ecosystem', type: 'folder', children: [
                        { name: 'hadoop-and-ecosystem-notes.md', type: 'file', path: '03-big-data-engineering/01-hadoop-and-ecosystem/hadoop-and-ecosystem-notes.md' }
                    ]
                },
                {
                    name: '02-hdfs', type: 'folder', children: [
                        { name: 'hdfs-notes.md', type: 'file', path: '03-big-data-engineering/02-hdfs/hdfs-notes.md' }
                    ]
                },
                {
                    name: '03-spark-core', type: 'folder', children: [
                        { name: 'spark-core-notes.md', type: 'file', path: '03-big-data-engineering/03-spark-core/spark-core-notes.md' }
                    ]
                },
                {
                    name: '04-spark-sql-and-optimization', type: 'folder', children: [
                        { name: 'spark-sql-and-optimization-notes.md', type: 'file', path: '03-big-data-engineering/04-spark-sql-and-optimization/spark-sql-and-optimization-notes.md' }
                    ]
                },
                {
                    name: '05-spark-structured-streaming', type: 'folder', children: [
                        { name: 'spark-structured-streaming-notes.md', type: 'file', path: '03-big-data-engineering/05-spark-structured-streaming/spark-structured-streaming-notes.md' }
                    ]
                },
                {
                    name: '06-kafka', type: 'folder', children: [
                        { name: 'kafka-notes.md', type: 'file', path: '03-big-data-engineering/06-kafka/kafka-notes.md' }
                    ]
                },
                {
                    name: '07-airflow-and-orchestration', type: 'folder', children: [
                        { name: 'airflow-and-orchestration-notes.md', type: 'file', path: '03-big-data-engineering/07-airflow-and-orchestration/airflow-and-orchestration-notes.md' }
                    ]
                },
                {
                    name: '08-delta-lake-and-delta-tables', type: 'folder', children: [
                        { name: 'delta-lake-and-delta-tables-notes.md', type: 'file', path: '03-big-data-engineering/08-delta-lake-and-delta-tables/delta-lake-and-delta-tables-notes.md' }
                    ]
                },
                {
                    name: '09-spark-4-1-and-sdp', type: 'folder', children: [
                        { name: 'spark-4-1-and-sdp-notes.md', type: 'file', path: '03-big-data-engineering/09-spark-4-1-and-sdp/spark-4-1-and-sdp-notes.md' }
                    ]
                },
                {
                    name: '10-hive-and-metastore', type: 'folder', children: [
                        { name: 'hive-and-metastore-notes.md', type: 'file', path: '03-big-data-engineering/10-hive-and-metastore/hive-and-metastore-notes.md' }
                    ]
                },
                {
                    name: '11-solr', type: 'folder', children: [
                        { name: 'solr-notes.md', type: 'file', path: '03-big-data-engineering/11-solr/solr-notes.md' }
                    ]
                },
                {
                    name: '12-iceberg-and-open-table-formats', type: 'folder', children: [
                        { name: 'iceberg-and-open-table-formats-notes.md', type: 'file', path: '03-big-data-engineering/12-iceberg-and-open-table-formats/iceberg-and-open-table-formats-notes.md' }
                    ]
                },
                {
                    name: '13-trino-and-interactive-querying', type: 'folder', children: [
                        { name: 'trino-and-interactive-querying-notes.md', type: 'file', path: '03-big-data-engineering/13-trino-and-interactive-querying/trino-and-interactive-querying-notes.md' }
                    ]
                },
                {
                    name: '14-data-platform-architecture', type: 'folder', children: [
                        { name: 'data-platform-architecture-notes.md', type: 'file', path: '03-big-data-engineering/14-data-platform-architecture/data-platform-architecture-notes.md' },
                        { name: 'yaml-pipelines-dlt-dbt-trino.md', type: 'file', path: '03-big-data-engineering/14-data-platform-architecture/yaml-pipelines-dlt-dbt-trino.md' }
                    ]
                },
                {
                    name: '15-interview-faq', type: 'folder', children: [
                        { name: 'behavioral-questions.md', type: 'file', path: '03-big-data-engineering/15-interview-faq/behavioral-questions.md' },
                        { name: 'scenario-based-questions.md', type: 'file', path: '03-big-data-engineering/15-interview-faq/scenario-based-questions.md' },
                        { name: 'technical-questions.md', type: 'file', path: '03-big-data-engineering/15-interview-faq/technical-questions.md' }
                    ]
                },
                {
                    name: 'spark',
                    type: 'folder',
                    children: [
                        {
                            name: 'core-concepts',
                            type: 'folder',
                            children: [
                                { name: 'Actions_vs_Transformations.md', type: 'file', path: '03-big-data-engineering/spark/core-concepts/Actions_vs_Transformations.md' },
                                { name: 'Narrow_vs_Wide_Transformations.md', type: 'file', path: '03-big-data-engineering/spark/core-concepts/Narrow_vs_Wide_Transformations.md' }
                            ]
                        },
                        {
                            name: 'integrations',
                            type: 'folder',
                            children: [
                                { name: 'Delta_Lake_101.md', type: 'file', path: '03-big-data-engineering/spark/integrations/Delta_Lake_101.md' },
                                { name: 'Livy_Delta_Lake.md', type: 'file', path: '03-big-data-engineering/spark/integrations/Livy_Delta_Lake.md' },
                                { name: 'Livy_SQL.md', type: 'file', path: '03-big-data-engineering/spark/integrations/Livy_SQL.md' },
                                { name: 'Spark_Declarative_Pipelines_101.md', type: 'file', path: '03-big-data-engineering/spark/integrations/Spark_Declarative_Pipelines_101.md' }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: '04-system-design',
            type: 'folder',
            children: [
                { name: 'README.md', type: 'file', path: '04-system-design/README.md' },
                {
                    name: '01-scalability-basics', type: 'folder', children: [
                        { name: 'scalability-basics-notes.md', type: 'file', path: '04-system-design/01-scalability-basics/scalability-basics-notes.md' }
                    ]
                },
                {
                    name: '02-networking-and-communication', type: 'folder', children: [
                        { name: 'networking-and-communication-notes.md', type: 'file', path: '04-system-design/02-networking-and-communication/networking-and-communication-notes.md' }
                    ]
                },
                {
                    name: '03-storage-systems', type: 'folder', children: [
                        { name: 'storage-systems-notes.md', type: 'file', path: '04-system-design/03-storage-systems/storage-systems-notes.md' }
                    ]
                },
                {
                    name: '04-databases', type: 'folder', children: [
                        { name: 'databases-notes.md', type: 'file', path: '04-system-design/04-databases/databases-notes.md' }
                    ]
                },
                {
                    name: '05-caching', type: 'folder', children: [
                        { name: 'caching-notes.md', type: 'file', path: '04-system-design/05-caching/caching-notes.md' }
                    ]
                },
                {
                    name: '06-messaging-and-stream-processing', type: 'folder', children: [
                        { name: 'messaging-and-stream-processing-notes.md', type: 'file', path: '04-system-design/06-messaging-and-stream-processing/messaging-and-stream-processing-notes.md' }
                    ]
                },
                {
                    name: '07-api-design-and-gateways', type: 'folder', children: [
                        { name: 'api-design-and-gateways-notes.md', type: 'file', path: '04-system-design/07-api-design-and-gateways/api-design-and-gateways-notes.md' }
                    ]
                },
                {
                    name: '08-load-balancing-and-proxies', type: 'folder', children: [
                        { name: 'load-balancing-and-proxies-notes.md', type: 'file', path: '04-system-design/08-load-balancing-and-proxies/load-balancing-and-proxies-notes.md' }
                    ]
                },
                {
                    name: '09-consistency-replication-and-partitioning', type: 'folder', children: [
                        { name: 'consistency-replication-and-partitioning-notes.md', type: 'file', path: '04-system-design/09-consistency-replication-and-partitioning/consistency-replication-and-partitioning-notes.md' }
                    ]
                },
                {
                    name: '10-microservices-and-architectural-patterns', type: 'folder', children: [
                        { name: 'microservices-and-architectural-patterns-notes.md', type: 'file', path: '04-system-design/10-microservices-and-architectural-patterns/microservices-and-architectural-patterns-notes.md' }
                    ]
                },
                {
                    name: '11-reliability-resilience-and-fault-tolerance', type: 'folder', children: [
                        { name: 'reliability-resilience-and-fault-tolerance-notes.md', type: 'file', path: '04-system-design/11-reliability-resilience-and-fault-tolerance/reliability-resilience-and-fault-tolerance-notes.md' }
                    ]
                },
                {
                    name: '12-security-and-multi-tenancy', type: 'folder', children: [
                        { name: 'security-and-multi-tenancy-notes.md', type: 'file', path: '04-system-design/12-security-and-multi-tenancy/security-and-multi-tenancy-notes.md' }
                    ]
                },
                {
                    name: '13-observability-capacity-and-performance', type: 'folder', children: [
                        { name: 'observability-capacity-and-performance-notes.md', type: 'file', path: '04-system-design/13-observability-capacity-and-performance/observability-capacity-and-performance-notes.md' }
                    ]
                },
                {
                    name: '14-back-of-the-envelope-estimation', type: 'folder', children: [
                        { name: 'back-of-the-envelope-estimation-notes.md', type: 'file', path: '04-system-design/14-back-of-the-envelope-estimation/back-of-the-envelope-estimation-notes.md' }
                    ]
                },
                {
                    name: '15-case-studies', type: 'folder', children: [
                        { name: 'README.md', type: 'file', path: '04-system-design/15-case-studies/README.md' },
                        { name: 'chat-system.md', type: 'file', path: '04-system-design/15-case-studies/chat-system.md' },
                        { name: 'file-storage.md', type: 'file', path: '04-system-design/15-case-studies/file-storage.md' },
                        { name: 'news-feed.md', type: 'file', path: '04-system-design/15-case-studies/news-feed.md' },
                        { name: 'notification-system.md', type: 'file', path: '04-system-design/15-case-studies/notification-system.md' },
                        { name: 'rate-limiter.md', type: 'file', path: '04-system-design/15-case-studies/rate-limiter.md' },
                        { name: 'ride-hailing.md', type: 'file', path: '04-system-design/15-case-studies/ride-hailing.md' },
                        { name: 'search-autocomplete.md', type: 'file', path: '04-system-design/15-case-studies/search-autocomplete.md' },
                        { name: 'url-shortener.md', type: 'file', path: '04-system-design/15-case-studies/url-shortener.md' },
                        { name: 'video-streaming.md', type: 'file', path: '04-system-design/15-case-studies/video-streaming.md' }
                    ]
                },
                {
                    name: '16-interview-faq', type: 'folder', children: [
                        { name: 'behavioral-questions.md', type: 'file', path: '04-system-design/16-interview-faq/behavioral-questions.md' },
                        { name: 'scenario-based-questions.md', type: 'file', path: '04-system-design/16-interview-faq/scenario-based-questions.md' },
                        { name: 'technical-questions.md', type: 'file', path: '04-system-design/16-interview-faq/technical-questions.md' }
                    ]
                }
            ]
        },
        {
            name: '05-cloud-and-devops',
            type: 'folder',
            children: [
                { name: 'README.md', type: 'file', path: '05-cloud-and-devops/README.md' },
                {
                    name: '01-linux', type: 'folder', children: [
                        { name: 'linux-notes.md', type: 'file', path: '05-cloud-and-devops/01-linux/linux-notes.md' }
                    ]
                },
                {
                    name: '02-networking', type: 'folder', children: [
                        { name: 'networking-notes.md', type: 'file', path: '05-cloud-and-devops/02-networking/networking-notes.md' }
                    ]
                },
                {
                    name: '03-git', type: 'folder', children: [
                        { name: 'git-notes.md', type: 'file', path: '05-cloud-and-devops/03-git/git-notes.md' }
                    ]
                },
                {
                    name: '04-docker', type: 'folder', children: [
                        { name: 'docker-notes.md', type: 'file', path: '05-cloud-and-devops/04-docker/docker-notes.md' }
                    ]
                },
                {
                    name: '05-kubernetes', type: 'folder', children: [
                        { name: 'kubernetes-notes.md', type: 'file', path: '05-cloud-and-devops/05-kubernetes/kubernetes-notes.md' }
                    ]
                },
                {
                    name: '06-ci-cd', type: 'folder', children: [
                        { name: 'ci-cd-notes.md', type: 'file', path: '05-cloud-and-devops/06-ci-cd/ci-cd-notes.md' }
                    ]
                },
                {
                    name: '07-jenkins', type: 'folder', children: [
                        { name: 'jenkins-notes.md', type: 'file', path: '05-cloud-and-devops/07-jenkins/jenkins-notes.md' }
                    ]
                },
                {
                    name: '08-terraform', type: 'folder', children: [
                        { name: 'terraform-notes.md', type: 'file', path: '05-cloud-and-devops/08-terraform/terraform-notes.md' }
                    ]
                },
                {
                    name: '09-ansible', type: 'folder', children: [
                        { name: 'ansible-notes.md', type: 'file', path: '05-cloud-and-devops/09-ansible/ansible-notes.md' }
                    ]
                },
                {
                    name: '10-aws', type: 'folder', children: [
                        { name: 'aws-notes.md', type: 'file', path: '05-cloud-and-devops/10-aws/aws-notes.md' }
                    ]
                },
                {
                    name: '11-azure', type: 'folder', children: [
                        { name: 'azure-notes.md', type: 'file', path: '05-cloud-and-devops/11-azure/azure-notes.md' }
                    ]
                },
                {
                    name: '12-aws-vs-azure', type: 'folder', children: [
                        { name: 'aws-vs-azure-notes.md', type: 'file', path: '05-cloud-and-devops/12-aws-vs-azure/aws-vs-azure-notes.md' }
                    ]
                },
                {
                    name: '13-monitoring', type: 'folder', children: [
                        { name: 'monitoring-notes.md', type: 'file', path: '05-cloud-and-devops/13-monitoring/monitoring-notes.md' }
                    ]
                },
                {
                    name: '14-shell-scripting', type: 'folder', children: [
                        { name: 'shell-scripting-notes.md', type: 'file', path: '05-cloud-and-devops/14-shell-scripting/shell-scripting-notes.md' }
                    ]
                },
                {
                    name: '15-gitops', type: 'folder', children: [
                        { name: 'gitops-notes.md', type: 'file', path: '05-cloud-and-devops/15-gitops/gitops-notes.md' }
                    ]
                },
                {
                    name: '16-interview-faq', type: 'folder', children: [
                        { name: 'behavioral-questions.md', type: 'file', path: '05-cloud-and-devops/16-interview-faq/behavioral-questions.md' },
                        { name: 'scenario-based-questions.md', type: 'file', path: '05-cloud-and-devops/16-interview-faq/scenario-based-questions.md' },
                        { name: 'technical-questions.md', type: 'file', path: '05-cloud-and-devops/16-interview-faq/technical-questions.md' }
                    ]
                }
            ]
        },
        {
            name: '06-specialized-topics',
            type: 'folder',
            children: [
                { name: 'README.md', type: 'file', path: '06-specialized-topics/README.md' },
                { name: 'agile', type: 'folder', children: [
                    { name: 'agile-notes.md', type: 'file', path: '06-specialized-topics/agile/agile-notes.md' }
                ]},
                {
                    name: 'python', type: 'folder', children: [
                        { name: 'pandas-notes.md', type: 'file', path: '06-specialized-topics/python/pandas-notes.md' }
                    ]
                },
                {
                    name: 'iot-embedded', type: 'folder', children: [
                        { name: 'DHT_Exporter.md', type: 'file', path: '06-specialized-topics/iot-embedded/DHT_Exporter.md' },
                        { name: 'ESP8266_DHT11.md', type: 'file', path: '06-specialized-topics/iot-embedded/ESP8266_DHT11.md' }
                    ]
                },
                {
                    name: 'testing', type: 'folder', children: [
                        { name: 'playwright-notes.md', type: 'file', path: '06-specialized-topics/testing/playwright-notes.md' }
                    ]
                },
                {
                    name: 'tools', type: 'folder', children: [
                        { name: 'custom-rule-builder', type: 'folder', children: [
                            { name: 'app.py', type: 'file', path: '06-specialized-topics/tools/custom-rule-builder/app.py' }
                        ]},
                        { name: 'jira', type: 'folder', children: [
                            { name: 'jira-notes.md', type: 'file', path: '06-specialized-topics/tools/jira/jira-notes.md' }
                        ]}
                    ]
                }
            ]
        },
        {
            name: '07-research',
            type: 'folder',
            children: [
                { name: 'README.md', type: 'file', path: '07-research/README.md' },
                { name: 'future-of-software-developer-role.md', type: 'file', path: '07-research/future-of-software-developer-role.md' },
                { name: 'index.html', type: 'html', path: '07-research/index.html' }
            ]
        },
        {
            name: 'interview-prep',
            type: 'folder',
            children: [
                { name: 'README.md', type: 'file', path: 'interview-prep/README.md' },
                { name: 'genesys.md', type: 'file', path: 'interview-prep/genesys.md' },
                {
                    name: 'genesys', type: 'folder', children: [
                        { name: 'README.md', type: 'file', path: 'interview-prep/genesys/README.md' },
                        { name: '01-role-overview.md', type: 'file', path: 'interview-prep/genesys/01-role-overview.md' },
                        { name: '02-conversational-ai.md', type: 'file', path: 'interview-prep/genesys/02-conversational-ai.md' },
                        { name: '03-llm-rag-systems.md', type: 'file', path: 'interview-prep/genesys/03-llm-rag-systems.md' },
                        { name: '04-agentic-ai.md', type: 'file', path: 'interview-prep/genesys/04-agentic-ai.md' },
                        { name: '05-mlops-aws.md', type: 'file', path: 'interview-prep/genesys/05-mlops-aws.md' },
                        { name: '06-system-design.md', type: 'file', path: 'interview-prep/genesys/06-system-design.md' },
                        { name: '07-coding-focus.md', type: 'file', path: 'interview-prep/genesys/07-coding-focus.md' },
                        { name: '08-behavioral.md', type: 'file', path: 'interview-prep/genesys/08-behavioral.md' },
                        { name: '09-qa-bank.md', type: 'file', path: 'interview-prep/genesys/09-qa-bank.md' },
                        { name: '10-final-revision.md', type: 'file', path: 'interview-prep/genesys/10-final-revision.md' }
                    ]
                },
                { name: 'behavioral', type: 'folder', children: [] },
                { name: 'coding-patterns', type: 'folder', children: [] },
                { name: 'quick-reference', type: 'folder', children: [] }
            ]
        },
        { name: 'README.md', type: 'file', path: 'README.md' },
        { name: 'NOTES_TEMPLATE.md', type: 'file', path: 'NOTES_TEMPLATE.md' },
        { name: 'RESTRUCTURING_SUMMARY.md', type: 'file', path: 'RESTRUCTURING_SUMMARY.md' }
    ]
};

// State
let currentPath = 'README.md';
let allFiles = [];
let fileContents = {};

// DOM Elements
const fileTreeEl = document.getElementById('fileTree');
const contentArea = document.getElementById('contentArea');
const breadcrumb = document.getElementById('breadcrumb');
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');
const overlay = document.getElementById('overlay');
const sidebarToggle = document.getElementById('sidebarToggle');
const scrollToTopBtn = document.getElementById('scrollToTop');
const progressBar = document.getElementById('progressBar');

// Command Palette & ToC DOM Elements
const searchTriggerBtn = document.getElementById('searchTriggerBtn');
const cmdOverlay = document.getElementById('commandPaletteOverlay');
const cmdPalette = document.getElementById('commandPalette');
const cmdInput = document.getElementById('cmdInput');
const cmdResults = document.getElementById('cmdResults');
const tocContainer = document.getElementById('tocContainer');

// Command Palette State
let cmdSelectedIndex = -1;
let currentCmdResults = [];

// Flatten file tree for search
function flattenTree(node, path = '') {
    const results = [];
    if (node.type === 'file' || node.type === 'html') {
        results.push({
            name: node.name,
            path: node.path,
            type: node.type,
            fullPath: path + node.name
        });
    }
    if (node.children) {
        for (const child of node.children) {
            results.push(...flattenTree(child, path + node.name + '/'));
        }
    }
    return results;
}

// Get folder icon based on name
function getFolderIcon(name) {
    const icons = {
        'DevOps': '⚙️',
        'SystemDesign': '🏗️',
        'BigData': '📊',
        '01-computer-science-fundamentals': '💻',
        '02-backend-development': '🔧',
        '03-big-data-engineering': '📈',
        '06-specialized-topics': '🔬',
        '07-research': '📝',
        'interview-prep': '🎯',
        'design-patterns': '🎨',
        'regex': '🔍',
        'api-gateway': '🚪',
        'databases': '🗄️',
        'fastapi': '⚡',
        'spark': '✨',
        '01-linux': '🐧',
        '02-networking': '🌐',
        '03-git': '📦',
        '04-docker': '🐳',
        '05-kubernetes': '☸️',
        '06-ci-cd': '🔄',
        '07-jenkins': '🔨',
        '08-terraform': '🏗️',
        '09-ansible': '🎭',
        '10-aws': '☁️',
        '11-azure': '🔷',
        '12-aws-vs-azure': '⚖️',
        '13-monitoring': '📊',
        '14-shell-scripting': '💻',
        '15-gitops': '🔄',
        '16-interview-faq': '❓',
        '01-hadoop-and-ecosystem': '🐘',
        '02-hdfs': '💾',
        '03-spark-core': '⚡',
        '04-spark-sql-and-optimization': '🔬',
        '05-spark-structured-streaming': '🌊',
        '06-kafka': '📨',
        '07-airflow-and-orchestration': '🎭',
        '08-delta-lake-and-delta-tables': '🏞️',
        '09-spark-4-1-and-sdp': '🚀',
        '10-hive-and-metastore': '🐝',
        '11-solr': '🔎',
        '12-iceberg-and-open-table-formats': '🧊',
        '13-trino-and-interactive-querying': '🔮',
        '14-data-platform-architecture': '🏛️',
        '15-case-studies': '📚',
        'iot-embedded': '🔌',
        'testing': '🧪',
        'genesys': '🤖'
    };
    return icons[name] || '📁';
}

// Render file tree
function renderTree(node, depth = 0) {
    if (node.type === 'file' || node.type === 'html') {
        const icon = node.type === 'html' ? '🌐' : '📄';
        return `
                <div class="tree-item py-1.5 px-2 rounded flex items-center gap-2" 
                     data-path="${node.path}" 
                     data-type="${node.type}"
                     style="padding-left: ${depth * 16 + 8}px">
                    <span class="w-4 flex-shrink-0"></span>
                    <span class="text-sm flex-shrink-0">${icon}</span>
                    <span class="truncate text-gray-300 text-sm">${node.name}</span>
                </div>
            `;
    }

    if (node.type === 'folder') {
        const isRoot = depth === 0;
        const folderIcon = getFolderIcon(node.name);
        return `
                <div class="tree-folder ${isRoot ? 'open' : ''}">
                    <div class="tree-header tree-item py-1.5 px-2 rounded flex items-center gap-2" 
                         style="padding-left: ${depth * 16 + 8}px">
                        <span class="tree-toggle flex items-center justify-center w-4 h-4 flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                        </span>
                        <span class="text-sm flex-shrink-0">${folderIcon}</span>
                        <span class="font-medium truncate text-gray-200 text-sm">${node.name}</span>
                    </div>
                    <div class="tree-children pl-0">
                        ${node.children ? node.children.map(child => renderTree(child, depth + 1)).join('') : ''}
                    </div>
                </div>
            `;
    }

    return '';
}

// Load markdown content
async function loadContent(path, type = 'file') {
    contentArea.style.opacity = '0';
    contentArea.innerHTML = `
            <div class="text-center py-12">
                <div class="loading-spinner mx-auto"></div>
                <p class="text-gray-400 mt-4">Loading ${path}...</p>
            </div>
        `;

    try {
        if (type === 'html') {
            contentArea.innerHTML = `
                    <div class="flex flex-col" style="min-height: calc(100vh - 10rem)">
                        <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-700">
                            <div>
                                <h2 class="text-xl font-bold">📊 Interactive Visualization</h2>
                                <p class="text-gray-400 text-sm">${path}</p>
                            </div>
                            <a href="${path}" target="_blank" 
                               class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium text-sm transition shrink-0">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                                </svg>
                                Open in New Tab
                            </a>
                        </div>
                        <iframe src="${path}" class="w-full flex-1 border-0 rounded-lg" style="min-height: 70vh"></iframe>
                    </div>
                `;
            updateBreadcrumb(path);
            updateHash(path);
            contentArea.style.opacity = '1';
            return;
        }

        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load ${path}`);

        const markdown = await response.text();
        fileContents[path] = markdown;

        // Configure marked (latest versions don't support highlight in setOptions)
        marked.setOptions({
            breaks: true,
            gfm: true
        });

        contentArea.innerHTML = marked.parse(markdown);
        
        // Render Mermaid diagrams if present
        if (window.mermaid) {
            try {
                // Ensure dark theme matches site
                window.mermaid.initialize({ startOnLoad: false, theme: 'dark' });
                // Prefer run API if available (Mermaid v10+)
                if (typeof window.mermaid.run === 'function') {
                    window.mermaid.run({ querySelector: '.language-mermaid' });
                } else if (typeof window.mermaid.init === 'function') {
                    window.mermaid.init(undefined, contentArea.querySelectorAll('.language-mermaid'));
                }
            } catch (e) {
                console.error('Mermaid render error', e);
            }
        }

        // Apply syntax highlighting
        if (window.Prism) {
            Prism.highlightAllUnder(contentArea);
        }

        // Add copy buttons to code blocks
        addCopyButtons();

        // Generate table of contents
        generateTableOfContents();

        // Fix relative links in markdown
        contentArea.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const basePath = path.substring(0, path.lastIndexOf('/') + 1);
                    let newPath = basePath + href;
                    // Normalize path
                    newPath = newPath.replace(/\/\.\//g, '/').replace(/[^/]+\/\.\.\//g, '');
                    // If path ends with /, it's a folder - append README.md
                    if (newPath.endsWith('/')) {
                        newPath += 'README.md';
                    }
                    loadContent(newPath);
                    highlightActiveFile(newPath);
                    updateHash(newPath);
                });
            }
        });

        updateBreadcrumb(path);
        currentPath = path;

        updateHash(path);

        // Scroll to top
        window.scrollTo(0, 0);

        // Fade in
        requestAnimationFrame(() => {
            contentArea.style.opacity = '1';
        });

    } catch (error) {
        contentArea.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-6xl mb-4">😕</div>
                    <h2 class="text-2xl font-bold mb-2">Failed to load content</h2>
                    <p class="text-gray-400 mb-4">${path}</p>
                    <p class="text-red-400 text-sm">${error.message}</p>
                    <button onclick="loadContent('README.md')" 
                            class="mt-6 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                        Go to Home
                    </button>
                </div>
            `;
        requestAnimationFrame(() => {
            contentArea.style.opacity = '1';
        });
    }
}

// Update breadcrumb
function updateBreadcrumb(path) {
    const parts = path.split('/');
    let html = '<span class="breadcrumb-item cursor-pointer hover:text-blue-400" onclick="loadContent(\'README.md\')">Home</span>';

    let currentPath = '';
    parts.forEach((part, index) => {
        currentPath += (index > 0 ? '/' : '') + part;
        const isLast = index === parts.length - 1;

        if (isLast) {
            html += `<span class="breadcrumb-item text-gray-200">${part}</span>`;
        } else {
            const folderPath = currentPath + '/README.md';
            html += `<span class="breadcrumb-item cursor-pointer hover:text-blue-400" onclick="loadContent('${folderPath}')">${part}</span>`;
        }
    });

    breadcrumb.innerHTML = html;
}

// Highlight active file in tree
function highlightActiveFile(path) {
    document.querySelectorAll('.tree-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.path === path) {
            item.classList.add('active');
            // Expand parent folders
            let parent = item.parentElement;
            while (parent) {
                if (parent.classList.contains('tree-folder')) {
                    parent.classList.add('open');
                }
                parent = parent.parentElement;
            }
        }
    });
}

// Command Palette Logic
function openCommandPalette() {
    cmdOverlay.classList.remove('hidden');
    requestAnimationFrame(() => {
        cmdOverlay.classList.remove('opacity-0');
        cmdPalette.classList.remove('scale-95', 'opacity-0');
        cmdInput.focus();
    });
    performCmdSearch('');
}

function closeCommandPalette() {
    cmdOverlay.classList.add('opacity-0');
    cmdPalette.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        cmdOverlay.classList.add('hidden');
        cmdInput.value = '';
    }, 200);
}

function performCmdSearch(query) {
    cmdSelectedIndex = -1;
    if (!query.trim()) {
        currentCmdResults = allFiles.slice(0, 10);
    } else {
        const lowerQuery = query.toLowerCase();
        currentCmdResults = allFiles.filter(file =>
            file.name.toLowerCase().includes(lowerQuery) ||
            file.path.toLowerCase().includes(lowerQuery)
        ).slice(0, 15);
    }
    renderCmdResults(query);
}

function renderCmdResults(query) {
    if (currentCmdResults.length === 0) {
        cmdResults.innerHTML = `
            <div class="p-8 text-center text-sm text-gray-500">
                No results found for "${query}"
            </div>
        `;
        return;
    }

    cmdResults.innerHTML = currentCmdResults.map((file, index) => {
        const icon = file.type === 'html' ? '🌐' : '📄';
        return `
            <div class="cmd-result flex items-center p-3 mb-1 rounded-lg" data-index="${index}">
                <span class="text-xl mr-3 opacity-70">${icon}</span>
                <div class="flex-1 min-w-0">
                    <div class="cmd-result-title font-medium text-sm text-gray-200 truncate">
                        ${query ? highlightMatch(file.name, query) : file.name}
                    </div>
                    <div class="text-xs text-gray-500 truncate">${file.path}</div>
                </div>
                <span class="hidden md:block text-xs text-gray-600 font-mono ml-3">↵</span>
            </div>
        `;
    }).join('');

    if (currentCmdResults.length > 0) {
        cmdSelectedIndex = 0;
        updateCmdSelection();
    }
}

function updateCmdSelection() {
    const items = cmdResults.querySelectorAll('.cmd-result');
    items.forEach((item, index) => {
        if (index === cmdSelectedIndex) {
            item.classList.add('active');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('active');
        }
    });
}

// Highlight search match
function highlightMatch(text, query) {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// Add copy buttons to code blocks
function addCopyButtons() {
    contentArea.querySelectorAll('pre').forEach(pre => {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        const codeEl = pre.querySelector('code');
        if (!codeEl) return;

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-button';
        copyBtn.textContent = 'Copy';
        copyBtn.onclick = async () => {
            const code = codeEl.textContent;
            await navigator.clipboard.writeText(code);
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
                copyBtn.classList.remove('copied');
            }, 2000);
        };
        wrapper.appendChild(copyBtn);
    });
}

// Generate table of contents
function generateTableOfContents() {
    if (!tocContainer) return;
    
    const headings = contentArea.querySelectorAll('h1, h2, h3, h4');
    if (headings.length === 0) {
        tocContainer.innerHTML = '';
        return;
    }

    const list = document.createElement('ul');
    list.className = 'toc-list';

    headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const id = `heading-${index}`;
        heading.id = id;

        const item = document.createElement('li');
        item.className = `toc-item level-${level}`;
        item.innerHTML = `<a>${heading.textContent}</a>`;
        item.style.cursor = 'pointer';
        item.addEventListener('click', (e) => {
            e.preventDefault();
            updateHash(currentPath, id);
            heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        list.appendChild(item);
    });

    tocContainer.innerHTML = '';
    tocContainer.appendChild(list);
}

// Update reading progress
function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${progress}%`;
}

// Hash-based routing
let updatingHash = false;

function updateHash(path, headingId) {
    updatingHash = true;
    window.location.hash = headingId ? `${path}~${headingId}` : path;
    setTimeout(() => { updatingHash = false; }, 100);
}

function getPathFromHash() {
    const raw = window.location.hash.slice(1);
    if (!raw) return null;
    const sep = raw.indexOf('~');
    const filePath = sep > -1 ? raw.slice(0, sep) : raw;
    const headingId = sep > -1 ? raw.slice(sep + 1) : null;
    const file = allFiles.find(f => f.path === filePath);
    return file ? { file, headingId } : null;
}

function scrollToHeading(headingId) {
    if (!headingId) return;
    const el = document.getElementById(headingId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Toggle sidebar
function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    document.querySelector('.main-content').classList.toggle('expanded');
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
}

// Toggle ToC sidebar
function toggleToc() {
    const tocSidebar = document.getElementById('tocSidebar');
    tocSidebar.classList.toggle('collapsed');
    localStorage.setItem('tocCollapsed', tocSidebar.classList.contains('collapsed'));
}

// Initialize
function init() {
    // Flatten tree for search
    allFiles = flattenTree(fileTree);

    // Render file tree
    fileTreeEl.innerHTML = fileTree.children.map(child => renderTree(child, 0)).join('');

    // File tree click handlers
    fileTreeEl.addEventListener('click', (e) => {
        const item = e.target.closest('.tree-item');
        if (!item) return;

        // Check if it's a folder header
        if (item.classList.contains('tree-header')) {
            const folder = item.closest('.tree-folder');
            folder.classList.toggle('open');
            return;
        }

        // It's a file
        const path = item.dataset.path;
        const type = item.dataset.type;
        if (path) {
            loadContent(path, type);
            highlightActiveFile(path);
            // Close mobile sidebar
            sidebar.classList.remove('open');
            overlay.classList.add('hidden');
        }
    });

    // Command Palette Triggers
    searchTriggerBtn.addEventListener('click', openCommandPalette);
    
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (cmdOverlay.classList.contains('hidden')) {
                openCommandPalette();
            } else {
                closeCommandPalette();
            }
        }
        
        // Command palette navigation
        if (!cmdOverlay.classList.contains('hidden')) {
            if (e.key === 'Escape') {
                closeCommandPalette();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (cmdSelectedIndex < currentCmdResults.length - 1) {
                    cmdSelectedIndex++;
                    updateCmdSelection();
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (cmdSelectedIndex > 0) {
                    cmdSelectedIndex--;
                    updateCmdSelection();
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (cmdSelectedIndex >= 0 && cmdSelectedIndex < currentCmdResults.length) {
                    const selectedFile = currentCmdResults[cmdSelectedIndex];
                    loadContent(selectedFile.path, selectedFile.type);
                    highlightActiveFile(selectedFile.path);
                    closeCommandPalette();
                }
            }
        }
    });

    cmdOverlay.addEventListener('click', (e) => {
        if (e.target === cmdOverlay) {
            closeCommandPalette();
        }
    });

    cmdInput.addEventListener('input', (e) => {
        performCmdSearch(e.target.value);
    });

    cmdResults.addEventListener('click', (e) => {
        const resultItem = e.target.closest('.cmd-result');
        if (resultItem) {
            const index = parseInt(resultItem.dataset.index);
            const selectedFile = currentCmdResults[index];
            loadContent(selectedFile.path, selectedFile.type);
            highlightActiveFile(selectedFile.path);
            closeCommandPalette();
            sidebar.classList.remove('open');
            overlay.classList.add('hidden');
        }
    });

    // Mobile menu
    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('hidden');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.add('hidden');
    });

    // Sidebar toggle (desktop)
    sidebarToggle.addEventListener('click', toggleSidebar);

    // ToC toggle
    const tocToggleBtn = document.getElementById('tocToggle');
    if (tocToggleBtn) {
        tocToggleBtn.addEventListener('click', toggleToc);
    }

    // Restore sidebar state from localStorage
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        sidebar.classList.add('collapsed');
        document.querySelector('.main-content').classList.add('expanded');
    }
    if (localStorage.getItem('tocCollapsed') === 'true') {
        const tocSidebar = document.getElementById('tocSidebar');
        if (tocSidebar) tocSidebar.classList.add('collapsed');
    }

    // Scroll events for progress bar and scroll-to-top button
    window.addEventListener('scroll', () => {
        updateProgress();
        if (window.scrollY > 500) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top button
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Hash-based routing: restore from URL or load default
    const hashData = getPathFromHash();
    if (hashData) {
        loadContent(hashData.file.path, hashData.file.type);
        highlightActiveFile(hashData.file.path);
        if (hashData.headingId) {
            setTimeout(() => scrollToHeading(hashData.headingId), 300);
        }
    } else {
        loadContent('README.md');
        highlightActiveFile('README.md');
    }

    // Handle browser back/forward
    window.addEventListener('hashchange', () => {
        if (updatingHash) return;
        const data = getPathFromHash();
        if (data) {
            loadContent(data.file.path, data.file.type);
            highlightActiveFile(data.file.path);
            if (data.headingId) {
                setTimeout(() => scrollToHeading(data.headingId), 300);
            }
        }
    });
}

// Start
init();
