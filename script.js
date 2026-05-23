
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
                        { name: 'binary-search-notes.md', type: 'file', path: '01-computer-science-fundamentals/algorithms/binary-search-notes.md' },
                        { name: 'dfs-notes.md', type: 'file', path: '01-computer-science-fundamentals/algorithms/dfs-notes.md' }
                    ]
                },
                {
                    name: 'data-structures',
                    type: 'folder',
                    children: [
                        { name: 'binary-search-tree-notes.md', type: 'file', path: '01-computer-science-fundamentals/data-structures/binary-search-tree-notes.md' }
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
                        { name: 'big-data-system-design.md', type: 'file', path: '04-system-design/15-case-studies/big-data-system-design.md' },
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
        { name: 'NOTES_TEMPLATE_101.md', type: 'file', path: 'NOTES_TEMPLATE_101.md' },
        { name: 'RESTRUCTURING_SUMMARY.md', type: 'file', path: 'RESTRUCTURING_SUMMARY.md' }
    ]
};

// State
let currentPath = 'README.md';
let allFiles = [];
let fileContents = {};
let searchIndex = []; // For background full-text indexing
let observer = null;  // For scrollspy intersection observer
let rootFontSize = 1.05; // Base font size in rem


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
                     role="button"
                     tabindex="0"
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
                         role="button"
                         tabindex="0"
                         aria-expanded="${isRoot ? 'true' : 'false'}"
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
            document.getElementById('readingTime').innerHTML = `⏱️ Interactive`;
            document.getElementById('wordCount').innerHTML = `📝 Web Visual`;
            updateBreadcrumb(path);
            updateHash(path);
            contentArea.style.opacity = '1';
            return;
        }

        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load ${path}`);

        const markdown = await response.text();
        fileContents[path] = markdown;

        // Calculate and update reading metrics
        const words = markdown.split(/\s+/).filter(Boolean).length;
        const minutes = Math.max(1, Math.ceil(words / 200));
        document.getElementById('readingTime').innerHTML = `⏱️ ${minutes} min read`;
        document.getElementById('wordCount').innerHTML = `📝 ${words} words`;

        // Configure marked
        marked.setOptions({
            breaks: true,
            gfm: true
        });

        contentArea.innerHTML = marked.parse(markdown);
        
        // Parse custom blockquote callouts into styled alert boxes
        renderAlerts(contentArea);
        
        // Render Mermaid diagrams if present
        if (window.mermaid) {
            try {
                window.mermaid.initialize({ startOnLoad: false, theme: 'dark' });
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

        // Add copy buttons and header bars to code blocks
        addCopyButtons();

        // Register images with Lightboxzoom listener
        setupLightbox();

        // Generate table of contents
        generateTableOfContents();

        // Setup Scrollspy observer for ToC
        setupScrollspy();

        // Fix relative links in markdown
        contentArea.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const basePath = path.substring(0, path.lastIndexOf('/') + 1);
                    let newPath = basePath + href;
                    newPath = newPath.replace(/\/\.\//g, '/').replace(/[^/]+\/\.\.\//g, '');
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
        document.getElementById('readingTime').innerHTML = `⏱️ 0 min read`;
        document.getElementById('wordCount').innerHTML = `📝 0 words`;
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
    cmdOverlay.setAttribute('aria-hidden', 'false');
    searchTriggerBtn.setAttribute('aria-expanded', 'true');
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
    searchTriggerBtn.setAttribute('aria-expanded', 'false');
    cmdOverlay.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
        cmdOverlay.classList.add('hidden');
        cmdInput.value = '';
    }, 200);
}

function performCmdSearch(query) {
    cmdSelectedIndex = -1;
    if (!query.trim()) {
        currentCmdResults = allFiles.slice(0, 10).map(file => ({
            ...file,
            snippet: ''
        }));
    } else {
        const lowerQuery = query.toLowerCase();
        const results = [];
        
        for (const file of allFiles) {
            const matchesName = file.name.toLowerCase().includes(lowerQuery);
            const matchesPath = file.path.toLowerCase().includes(lowerQuery);
            
            const indexedFile = searchIndex.find(idxFile => idxFile.path === file.path);
            const matchesContent = indexedFile ? indexedFile.lowerContent.includes(lowerQuery) : false;
            
            if (matchesName || matchesPath || matchesContent) {
                let snippet = '';
                if (indexedFile && matchesContent) {
                    snippet = getContextSnippet(indexedFile.content, query);
                } else if (indexedFile) {
                    snippet = indexedFile.content.substring(0, 80) + (indexedFile.content.length > 80 ? '...' : '');
                }
                
                results.push({
                    ...file,
                    snippet: snippet,
                    score: matchesName ? 10 : (matchesPath ? 5 : 1)
                });
            }
        }
        
        currentCmdResults = results
            .sort((a, b) => b.score - a.score)
            .slice(0, 15);
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
        const highlightedName = query ? highlightMatch(file.name, query) : file.name;
        const highlightedPath = query ? highlightMatch(file.path, query) : file.path;
        
        let snippetHtml = '';
        if (file.snippet) {
            const highlightedSnippet = query ? highlightMatch(file.snippet, query) : file.snippet;
            snippetHtml = `
                <div class="cmd-result-snippet text-xs text-gray-400 mt-1 pl-4 border-l-2 border-primary/20 italic">
                    ${highlightedSnippet}
                </div>
            `;
        }
        
        return `
            <div class="cmd-result flex flex-col p-3 mb-1 rounded-lg transition-all" data-index="${index}">
                <div class="flex items-center">
                    <span class="text-xl mr-3 opacity-70 flex-shrink-0">${icon}</span>
                    <div class="flex-1 min-w-0">
                        <div class="cmd-result-title font-medium text-sm text-gray-200 truncate">
                            ${highlightedName}
                        </div>
                        <div class="text-xs text-gray-500 truncate">${highlightedPath}</div>
                    </div>
                    <span class="hidden md:block text-xs text-gray-600 font-mono ml-3 shrink-0">↵</span>
                </div>
                ${snippetHtml}
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
        const isSelected = index === cmdSelectedIndex;
        item.classList.toggle('active', isSelected);
        item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        if (isSelected) {
            item.scrollIntoView({ block: 'nearest' });
        }
    });
}

// Highlight search match
function highlightMatch(text, query) {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// Robust copy to clipboard utility (works in secure and insecure contexts)
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for non-HTTPS or local file:// protocols
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (successful) {
                return Promise.resolve();
            } else {
                return Promise.reject(new Error('Fallback copy failed'));
            }
        } catch (err) {
            document.body.removeChild(textArea);
            return Promise.reject(err);
        }
    }
}

// Add copy buttons to code blocks
function addCopyButtons() {
    contentArea.querySelectorAll('pre').forEach(pre => {
        if (pre.parentNode && pre.parentNode.classList.contains('code-block-wrapper')) return;
        
        const codeEl = pre.querySelector('code');
        if (codeEl && (codeEl.classList.contains('language-mermaid') || codeEl.classList.contains('mermaid'))) {
            // Do not wrap Mermaid diagrams in the code block wrapper chrome
            return;
        }
        
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        if (!codeEl) return;

        let lang = 'CODE';
        const classes = Array.from(codeEl.classList);
        const langClass = classes.find(c => c.startsWith('language-'));
        if (langClass) {
            lang = langClass.replace('language-', '').toUpperCase();
        }

        const headerBar = document.createElement('div');
        headerBar.className = 'code-block-header';
        
        const macControls = document.createElement('div');
        macControls.className = 'mac-controls';
        macControls.innerHTML = `
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
        `;
        
        const langLabel = document.createElement('span');
        langLabel.className = 'code-lang';
        langLabel.textContent = lang;

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-button';
        copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
        copyBtn.innerHTML = `
            <svg class="copy-icon" viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/></svg>
            <span class="copy-text">Copy</span>
        `;
        
        copyBtn.onclick = async () => {
            const code = codeEl.textContent;
            try {
                await copyToClipboard(code);
                
                copyBtn.classList.add('copied');
                const copyText = copyBtn.querySelector('.copy-text');
                if (copyText) copyText.textContent = 'Copied!';
                
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    if (copyText) copyText.textContent = 'Copy';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy code block:', err);
            }
        };

        headerBar.appendChild(macControls);
        headerBar.appendChild(langLabel);
        headerBar.appendChild(copyBtn);
        
        wrapper.insertBefore(headerBar, pre);
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

// Render GitHub Alert blocks from blockquotes
function renderAlerts(container) {
    const blockquotes = container.querySelectorAll('blockquote');
    blockquotes.forEach(bq => {
        const text = bq.textContent.trim();
        const match = text.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
        if (match) {
            const type = match[1].toUpperCase();
            const typeClass = `alert-${type.toLowerCase()}`;
            
            let iconSvg = '';
            if (type === 'NOTE') {
                iconSvg = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
            } else if (type === 'TIP') {
                iconSvg = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`;
            } else if (type === 'IMPORTANT') {
                iconSvg = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;
            } else if (type === 'WARNING') {
                iconSvg = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;
            } else if (type === 'CAUTION') {
                iconSvg = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>`;
            }
            
            let html = bq.innerHTML;
            html = html.replace(/\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](\s*<br\s*\/?>)?/gi, '');
            
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert-block ${typeClass}`;
            alertDiv.innerHTML = `
                <div class="alert-header">
                    <span class="alert-icon">${iconSvg}</span>
                    <span>${type}</span>
                </div>
                <div class="alert-content">
                    ${html}
                </div>
            `;
            
            bq.parentNode.replaceChild(alertDiv, bq);
        }
    });
}

// Setup Scrollspy for Table of Contents
function setupScrollspy() {
    if (!tocContainer) return;
    
    if (observer) {
        observer.disconnect();
    }
    
    const headings = contentArea.querySelectorAll('h1, h2, h3, h4');
    if (headings.length === 0) return;
    
    const tocItems = tocContainer.querySelectorAll('.toc-item');
    if (tocItems.length === 0) return;

    const visibleHeadings = new Map();
    
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            visibleHeadings.set(entry.target.id, entry.isIntersecting);
        });
        
        let activeHeadingId = null;
        for (const heading of headings) {
            if (visibleHeadings.get(heading.id)) {
                activeHeadingId = heading.id;
                break;
            }
        }
        
        if (!activeHeadingId) {
            let minDistance = Infinity;
            headings.forEach(heading => {
                const rect = heading.getBoundingClientRect();
                const dist = Math.abs(rect.top);
                if (dist < minDistance) {
                    minDistance = dist;
                    activeHeadingId = heading.id;
                }
            });
        }
        
        if (activeHeadingId) {
            headings.forEach((heading, idx) => {
                const item = tocItems[idx];
                if (item) {
                    const isCurrent = heading.id === activeHeadingId;
                    item.classList.toggle('active', isCurrent);
                }
            });
        }
    }, {
        rootMargin: '-85px 0px -55% 0px',
        threshold: 0
    });
    
    headings.forEach(h => observer.observe(h));
}

// Setup Lightbox for image Zooming
function setupLightbox() {
    const images = contentArea.querySelectorAll('img');
    images.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            const lightboxOverlay = document.getElementById('lightboxOverlay');
            const lightboxImage = document.getElementById('lightboxImage');
            const lightboxCaption = document.getElementById('lightboxCaption');
            if (!lightboxOverlay || !lightboxImage || !lightboxCaption) return;

            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt || '';
            lightboxCaption.textContent = img.alt || img.title || 'Image Preview';
            
            lightboxOverlay.classList.add('active');
        });
    });
}

function closeLightbox() {
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    if (lightboxOverlay) {
        lightboxOverlay.classList.remove('active');
    }
}

// Asynchronously load and cache file contents for context search
async function indexAllFiles() {
    setTimeout(async () => {
        for (const file of allFiles) {
            if (file.type !== 'file') continue;
            try {
                let content = fileContents[file.path];
                if (!content) {
                    const response = await fetch(file.path);
                    if (response.ok) {
                        content = await response.text();
                        fileContents[file.path] = content;
                    }
                }
                
                if (content) {
                    const existingIndex = searchIndex.findIndex(item => item.path === file.path);
                    const indexedData = {
                        name: file.name,
                        path: file.path,
                        content: content,
                        lowerContent: content.toLowerCase()
                    };
                    if (existingIndex > -1) {
                        searchIndex[existingIndex] = indexedData;
                    } else {
                        searchIndex.push(indexedData);
                    }
                }
            } catch (e) {
                console.warn(`Could not index ${file.path}:`, e);
            }
            await new Promise(r => setTimeout(r, 60));
        }
    }, 1200);
}

// Extract context snippets for search results
function getContextSnippet(content, query, maxLen = 80) {
    if (!content) return '';
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const idx = lowerContent.indexOf(lowerQuery);
    if (idx === -1) {
        return content.length > maxLen ? content.substring(0, maxLen) + '...' : content;
    }
    
    let start = Math.max(0, idx - Math.floor(maxLen / 2));
    let end = Math.min(content.length, idx + lowerQuery.length + Math.floor(maxLen / 2));
    
    let snippet = content.substring(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';
    return snippet;
}

// Theme Switcher Picker bindings
function setupThemePicker() {
    const themePickerBtn = document.getElementById('themePickerBtn');
    const themeDropdown = document.getElementById('themeDropdown');
    if (!themePickerBtn || !themeDropdown) return;

    themePickerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = themeDropdown.classList.toggle('active');
        themePickerBtn.setAttribute('aria-expanded', isOpen.toString());
    });

    document.addEventListener('click', (e) => {
        if (!themeDropdown.contains(e.target) && e.target !== themePickerBtn) {
            themeDropdown.classList.remove('active');
            themePickerBtn.setAttribute('aria-expanded', 'false');
        }
    });

    const themeOptions = themeDropdown.querySelectorAll('.theme-option-btn');
    themeOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            if (theme) {
                setTheme(theme);
            }
            themeDropdown.classList.remove('active');
            themePickerBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeDropdown = document.getElementById('themeDropdown');
    if (themeDropdown) {
        const themeOptions = themeDropdown.querySelectorAll('.theme-option-btn');
        themeOptions.forEach(btn => {
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

// Accessibility sizers (font controls)
function setupFontControls() {
    const fontDecreaseBtn = document.getElementById('fontDecreaseBtn');
    const fontIncreaseBtn = document.getElementById('fontIncreaseBtn');
    if (!fontDecreaseBtn || !fontIncreaseBtn) return;

    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        rootFontSize = parseFloat(savedFontSize);
        contentArea.style.fontSize = `${rootFontSize}rem`;
    }

    fontDecreaseBtn.addEventListener('click', () => {
        if (rootFontSize > 0.85) {
            rootFontSize = parseFloat((rootFontSize - 0.05).toFixed(2));
            contentArea.style.fontSize = `${rootFontSize}rem`;
            localStorage.setItem('fontSize', rootFontSize.toString());
        }
    });

    fontIncreaseBtn.addEventListener('click', () => {
        if (rootFontSize < 1.4) {
            rootFontSize = parseFloat((rootFontSize + 0.05).toFixed(2));
            contentArea.style.fontSize = `${rootFontSize}rem`;
            localStorage.setItem('fontSize', rootFontSize.toString());
        }
    });
}

// Share note copy link button action
function setupShareLink() {
    const shareLinkBtn = document.getElementById('shareLinkBtn');
    if (!shareLinkBtn) return;
    
    shareLinkBtn.addEventListener('click', async () => {
        const url = window.location.href;
        try {
            await copyToClipboard(url);
            
            const originalHtml = shareLinkBtn.innerHTML;
            shareLinkBtn.innerHTML = `
                <svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
            `;
            shareLinkBtn.classList.add('active');
            
            setTimeout(() => {
                shareLinkBtn.innerHTML = originalHtml;
                shareLinkBtn.classList.remove('active');
            }, 2000);
        } catch (e) {
            console.error('Failed to copy share link:', e);
        }
    });
}

// Recursive sidebar folder/file visual tree filter
function filterSidebarTree(query) {
    const trimmed = query.trim().toLowerCase();
    
    if (!trimmed) {
        document.querySelectorAll('.tree-folder').forEach(folder => {
            folder.style.display = '';
            folder.classList.remove('filtered-open');
        });
        document.querySelectorAll('.tree-item').forEach(item => {
            item.style.display = '';
        });
        
        const activeItem = document.querySelector('.tree-item.active');
        if (activeItem) {
            let parent = activeItem.parentElement;
            while (parent) {
                if (parent.classList.contains('tree-folder')) {
                    parent.classList.add('open');
                    const header = parent.querySelector('.tree-header');
                    if (header) header.setAttribute('aria-expanded', 'true');
                }
                parent = parent.parentElement;
            }
        }
        return;
    }

    const allFolders = Array.from(document.querySelectorAll('.tree-folder'));
    
    const foldersSorted = allFolders.sort((a, b) => {
        const depthA = getElementDepth(a);
        const depthB = getElementDepth(b);
        return depthB - depthA;
    });

    function getElementDepth(el) {
        let depth = 0;
        let parent = el.parentElement;
        while (parent) {
            if (parent.classList.contains('tree-folder')) depth++;
            parent = parent.parentElement;
        }
        return depth;
    }

    document.querySelectorAll('.tree-item:not(.tree-header)').forEach(fileItem => {
        const text = fileItem.textContent.trim().toLowerCase();
        if (text.includes(trimmed)) {
            fileItem.style.display = 'flex';
        } else {
            fileItem.style.display = 'none';
        }
    });

    foldersSorted.forEach(folder => {
        const header = folder.querySelector('.tree-header');
        const folderName = header ? header.textContent.trim().toLowerCase() : '';
        const folderMatches = folderName.includes(trimmed);

        const childrenContainer = folder.querySelector('.tree-children');
        let hasVisibleChildren = false;
        
        if (childrenContainer) {
            const childFiles = Array.from(childrenContainer.children).filter(c => c.classList.contains('tree-item') && !c.classList.contains('tree-header'));
            const hasVisibleChildFiles = childFiles.some(f => f.style.display !== 'none');
            
            const childFolders = Array.from(childrenContainer.children).filter(c => c.classList.contains('tree-folder'));
            const hasVisibleChildFolders = childFolders.some(f => f.style.display !== 'none');
            
            hasVisibleChildren = hasVisibleChildFiles || hasVisibleChildFolders;
        }

        if (folderMatches || hasVisibleChildren) {
            folder.style.display = '';
            if (header) {
                header.style.display = 'flex';
            }
            if (hasVisibleChildren) {
                folder.classList.add('open');
                if (header) header.setAttribute('aria-expanded', 'true');
            }
        } else {
            folder.style.display = 'none';
            if (header) {
                header.style.display = 'none';
            }
        }
    });
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
            const isOpen = folder.classList.toggle('open');
            item.setAttribute('aria-expanded', isOpen.toString());
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

    fileTreeEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const item = e.target.closest('.tree-item');
            if (!item) return;
            e.preventDefault();
            item.click();
        }
    });

    // Command Palette Triggers
    searchTriggerBtn.addEventListener('click', openCommandPalette);
    
    document.addEventListener('keydown', (e) => {
        const lightboxOverlay = document.getElementById('lightboxOverlay');
        if (lightboxOverlay && lightboxOverlay.classList.contains('active')) {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeLightbox();
                return;
            }
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (cmdOverlay.classList.contains('hidden')) {
                openCommandPalette();
            } else {
                closeCommandPalette();
            }
        }
        
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

    // Restore sidebar state from localStorage (default to open)
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed');
    if (sidebarCollapsed === 'true') {
        sidebar.classList.add('collapsed');
        document.querySelector('.main-content').classList.add('expanded');
    } else {
        // Ensure sidebar is visible by default
        sidebar.classList.remove('collapsed');
        document.querySelector('.main-content').classList.remove('expanded');
    }
    const tocCollapsed = localStorage.getItem('tocCollapsed');
    if (tocCollapsed === 'true') {
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

    // Tree Search Filtering
    const treeSearchInput = document.getElementById('treeSearchInput');
    if (treeSearchInput) {
        treeSearchInput.addEventListener('input', (e) => {
            filterSidebarTree(e.target.value);
        });
    }

    // Lightbox close overlay click
    const lOverlay = document.getElementById('lightboxOverlay');
    if (lOverlay) {
        lOverlay.addEventListener('click', (e) => {
            if (e.target === lOverlay || e.target.id === 'lightboxOverlay') {
                closeLightbox();
            }
        });
    }

    // Theme Selector
    setupThemePicker();

    // Restore saved theme on startup
    const savedTheme = localStorage.getItem('theme') || 'slate';
    setTheme(savedTheme);

    // Font Controls
    setupFontControls();

    // Share link
    setupShareLink();

    // Background indexing of all files
    indexAllFiles();

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
