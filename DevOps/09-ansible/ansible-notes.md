---
layout: default
render_with_liquid: false
---
# Ansible — DevOps Interview Preparation Notes

---

## 1. Introduction

**Ansible** is an open-source IT automation tool used for configuration management, application deployment, orchestration, and provisioning. It is maintained by Red Hat.

### Key Characteristics

- **Agentless Architecture** — No agent or daemon needs to be installed on managed nodes. Ansible communicates over **SSH** (Linux) or **WinRM** (Windows).
- **Push-Based Model** — The control node pushes configurations to managed nodes on demand, unlike pull-based tools (Puppet, Chef) where agents periodically pull configs.
- **Idempotent** — Running the same playbook multiple times produces the same result without unintended side effects.
- **Declarative & Procedural** — Playbooks describe the desired state (declarative), but tasks execute in order (procedural).
- **YAML-Based** — Playbooks and configuration are written in human-readable YAML.

### Why Ansible Matters for DevOps

- Simplifies infrastructure as code (IaC)
- Reduces configuration drift across environments
- Integrates with CI/CD pipelines (Jenkins, GitLab CI, GitHub Actions)
- Supports multi-cloud and hybrid environments
- Low learning curve compared to Puppet/Chef
- Large community and 30,000+ modules via Ansible Galaxy

---

## 2. Core Concepts

### Architecture

```
+------------------+          SSH/WinRM          +------------------+
|   Control Node   | -------------------------> |   Managed Node 1 |
|  (Ansible CLI)   | -------------------------> |   Managed Node 2 |
|                  | -------------------------> |   Managed Node N |
+------------------+                             +------------------+
      |
      |--- ansible.cfg (configuration)
      |--- inventory (hosts)
      |--- playbooks (.yml)
      |--- roles/
```

- **Control Node** — Machine where Ansible is installed and playbooks are executed from. Must be Linux (Windows not supported as control node).
- **Managed Nodes** — Target machines managed by Ansible. No agent required.
- **SSH** — Default communication protocol for Linux nodes (port 22).
- **WinRM** — Communication protocol for Windows nodes.

### Inventory

Inventory defines the hosts and groups Ansible manages.

#### Static Inventory (`/etc/ansible/hosts` or custom file)

```ini
[webservers]
web1.example.com ansible_host=192.168.1.10
web2.example.com ansible_host=192.168.1.11

[dbservers]
db1.example.com ansible_host=192.168.1.20

[all:vars]
ansible_user=deploy
ansible_ssh_private_key_file=~/.ssh/id_rsa

[production:children]
webservers
dbservers
```

#### Dynamic Inventory

Scripts or plugins that generate inventory from external sources (AWS, Azure, GCP, VMware, CMDB).

```bash
# Use AWS EC2 dynamic inventory plugin
ansible-inventory -i aws_ec2.yml --list
```

### Ad-Hoc Commands

One-liner commands for quick tasks without writing a playbook.

```bash
# Ping all hosts
ansible all -m ping

# Check disk space
ansible webservers -m shell -a "df -h"

# Copy a file
ansible all -m copy -a "src=/tmp/file.txt dest=/opt/file.txt"

# Install a package
ansible webservers -m yum -a "name=httpd state=present" --become

# Restart a service
ansible webservers -m service -a "name=httpd state=restarted" --become
```

### Playbooks

Playbooks are YAML files that define automation workflows.

```yaml
---
- name: Configure web servers
  hosts: webservers
  become: yes
  vars:
    http_port: 80

  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: present
        update_cache: yes

    - name: Start Nginx service
      service:
        name: nginx
        state: started
        enabled: yes
```

### Plays, Tasks, and Handlers

- **Play** — Maps a group of hosts to a set of tasks.
- **Task** — A single unit of action (calls a module).
- **Handler** — A special task triggered by `notify`, runs once at the end of a play (used for service restarts).

```yaml
tasks:
  - name: Update Nginx config
    template:
      src: nginx.conf.j2
      dest: /etc/nginx/nginx.conf
    notify: Restart Nginx

handlers:
  - name: Restart Nginx
    service:
      name: nginx
      state: restarted
```

### Roles (Directory Structure)

Roles provide a reusable, organized structure for playbooks.

```
roles/
  webserver/
    tasks/
      main.yml        # Main task list
    handlers/
      main.yml        # Handlers
    templates/
      nginx.conf.j2   # Jinja2 templates
    files/
      index.html      # Static files
    vars/
      main.yml        # Role variables
    defaults/
      main.yml        # Default variables (lowest precedence)
    meta/
      main.yml        # Role metadata and dependencies
    tests/
      test.yml        # Test playbook
```

### Modules

| Module | Purpose | Example |
|--------|---------|---------|
| `command` | Run command (no shell features) | `command: whoami` |
| `shell` | Run command via shell (`/bin/sh`) | `shell: cat /etc/passwd \| grep root` |
| `copy` | Copy files to remote nodes | `copy: src=file.txt dest=/tmp/` |
| `file` | Manage file properties | `file: path=/tmp/dir state=directory` |
| `template` | Deploy Jinja2 templates | `template: src=app.conf.j2 dest=/etc/app.conf` |
| `yum` | Package management (RHEL/CentOS) | `yum: name=httpd state=present` |
| `apt` | Package management (Debian/Ubuntu) | `apt: name=nginx state=latest` |
| `service` | Manage services | `service: name=nginx state=started enabled=yes` |
| `user` | Manage user accounts | `user: name=deploy shell=/bin/bash` |
| `lineinfile` | Manage lines in text files | `lineinfile: path=/etc/hosts line="10.0.0.1 app"` |
| `debug` | Print debug messages | `debug: msg="Variable is {{ my_var }}"` |

### Variables

#### Variable Precedence (lowest to highest)

1. Role defaults (`defaults/main.yml`)
2. Inventory variables
3. Inventory `group_vars/`
4. Inventory `host_vars/`
5. Playbook `group_vars/`
6. Playbook `host_vars/`
7. Host facts / registered vars
8. Play vars
9. Play `vars_prompt`
10. Play `vars_files`
11. Role vars (`vars/main.yml`)
12. Block vars
13. Task vars
14. Extra vars (`-e` flag) — **highest precedence**

#### host_vars and group_vars

```
inventory/
  hosts
  group_vars/
    webservers.yml    # Variables for webservers group
    all.yml           # Variables for all hosts
  host_vars/
    web1.example.com.yml  # Variables for specific host
```

#### Registered Variables

```yaml
- name: Check disk usage
  shell: df -h /
  register: disk_result

- name: Show disk usage
  debug:
    msg: "{{ disk_result.stdout }}"
```

#### Facts (Gathered Automatically)

```yaml
- name: Display OS family
  debug:
    msg: "OS is {{ ansible_os_family }}"

# Disable fact gathering for performance
- hosts: all
  gather_facts: no
```

### Jinja2 Templates

Templates use Jinja2 syntax for dynamic configuration files.

```jinja2
# nginx.conf.j2
server {
    listen {{ http_port }};
    server_name {{ server_name }};

    location / {
        root {{ doc_root }};
        index index.html;
    }

    {% if enable_ssl %}
    listen 443 ssl;
    ssl_certificate {{ ssl_cert_path }};
    ssl_certificate_key {{ ssl_key_path }};
    {% endif %}

    {% for upstream in backend_servers %}
    upstream backend {
        server {{ upstream }}:{{ backend_port }};
    }
    {% endfor %}
}
```

### Conditionals (`when`)

```yaml
- name: Install on Debian
  apt:
    name: nginx
    state: present
  when: ansible_os_family == "Debian"

- name: Install on RedHat
  yum:
    name: nginx
    state: present
  when: ansible_os_family == "RedHat"

- name: Restart only if config changed
  service:
    name: nginx
    state: restarted
  when: config_result.changed
```

### Loops

```yaml
# loop (modern syntax)
- name: Install multiple packages
  apt:
    name: "{{ item }}"
    state: present
  loop:
    - nginx
    - git
    - curl
    - vim

# with_items (legacy syntax)
- name: Create users
  user:
    name: "{{ item.name }}"
    groups: "{{ item.groups }}"
  with_items:
    - { name: 'alice', groups: 'admin' }
    - { name: 'bob', groups: 'developers' }

# loop with dict
- name: Set sysctl values
  sysctl:
    name: "{{ item.key }}"
    value: "{{ item.value }}"
  loop: "{{ lookup('dict', sysctl_params) }}"
```

### Tags

```yaml
tasks:
  - name: Install packages
    apt:
      name: nginx
    tags: [install, packages]

  - name: Configure Nginx
    template:
      src: nginx.conf.j2
      dest: /etc/nginx/nginx.conf
    tags: [configure]
```

```bash
# Run only tagged tasks
ansible-playbook site.yml --tags "install"

# Skip tagged tasks
ansible-playbook site.yml --skip-tags "configure"
```

### Ansible Vault

Encrypt sensitive data (passwords, API keys, certificates).

```bash
# Create encrypted file
ansible-vault create secrets.yml

# Encrypt existing file
ansible-vault encrypt vars.yml

# Decrypt file
ansible-vault decrypt vars.yml

# Edit encrypted file
ansible-vault edit secrets.yml

# View encrypted file
ansible-vault view secrets.yml

# Run playbook with vault password
ansible-playbook site.yml --ask-vault-pass
ansible-playbook site.yml --vault-password-file ~/.vault_pass
```

### Ansible Galaxy

Repository for sharing and downloading roles.

```bash
# Install a role
ansible-galaxy install geerlingguy.docker

# Create role skeleton
ansible-galaxy init my_custom_role

# Install roles from requirements file
ansible-galaxy install -r requirements.yml
```

### AWX / Ansible Tower

- **AWX** — Open-source upstream project for Ansible Tower.
- **Ansible Tower (now Ansible Automation Platform)** — Enterprise web UI, REST API, RBAC, scheduling, logging, inventory management.
- Features: job templates, workflows, credentials management, notifications, audit trail.

### Idempotency

Running a playbook multiple times results in the same state. Ansible modules check current state before making changes:

```yaml
# Idempotent — only installs if not present
- apt:
    name: nginx
    state: present

# NOT idempotent — runs every time
- shell: echo "hello" >> /tmp/log.txt

# Fix: use lineinfile for idempotent file edits
- lineinfile:
    path: /tmp/log.txt
    line: "hello"
```

### Privilege Escalation (`become`)

```yaml
- hosts: webservers
  become: yes             # Enable sudo
  become_user: root       # Target user (default: root)
  become_method: sudo     # Method: sudo, su, pbrun, pfexec

  tasks:
    - name: Install package
      apt:
        name: nginx
        state: present
```

---

## 3. Practical Examples

### Complete Inventory File

```ini
# inventory/hosts
[webservers]
web1 ansible_host=10.0.1.10 ansible_port=22
web2 ansible_host=10.0.1.11 ansible_port=22

[dbservers]
db1 ansible_host=10.0.2.10
db2 ansible_host=10.0.2.11

[loadbalancers]
lb1 ansible_host=10.0.0.10

[production:children]
webservers
dbservers
loadbalancers

[all:vars]
ansible_user=deploy
ansible_ssh_private_key_file=~/.ssh/deploy_key
ansible_python_interpreter=/usr/bin/python3
```

### Ad-Hoc Command Examples

```bash
# Ping all hosts in inventory
ansible all -i inventory/hosts -m ping

# Get system info
ansible webservers -m setup -a "filter=ansible_distribution*"

# Create a directory
ansible all -m file -a "path=/opt/app state=directory mode=0755" --become

# Restart service
ansible webservers -m systemd -a "name=nginx state=restarted" --become

# Run on specific host
ansible web1 -m shell -a "uptime"

# Parallel execution (10 hosts at a time)
ansible all -m ping -f 10
```

### Playbook: Install and Configure Nginx

```yaml
---
- name: Install and Configure Nginx
  hosts: webservers
  become: yes
  vars:
    http_port: 80
    server_name: myapp.example.com
    doc_root: /var/www/html

  tasks:
    - name: Update apt cache
      apt:
        update_cache: yes
        cache_valid_time: 3600

    - name: Install Nginx
      apt:
        name: nginx
        state: present

    - name: Deploy Nginx configuration
      template:
        src: templates/nginx.conf.j2
        dest: /etc/nginx/sites-available/default
        owner: root
        group: root
        mode: '0644'
      notify: Reload Nginx

    - name: Deploy custom index page
      template:
        src: templates/index.html.j2
        dest: "{{ doc_root }}/index.html"
        owner: www-data
        group: www-data
        mode: '0644'

    - name: Ensure Nginx is running and enabled
      service:
        name: nginx
        state: started
        enabled: yes

    - name: Allow HTTP through firewall
      ufw:
        rule: allow
        port: "{{ http_port }}"
        proto: tcp

  handlers:
    - name: Reload Nginx
      service:
        name: nginx
        state: reloaded
```

### Role Directory Structure Example

```bash
ansible-galaxy init lamp_stack
```

```
roles/lamp_stack/
├── defaults/
│   └── main.yml
├── files/
│   └── my.cnf
├── handlers/
│   └── main.yml
├── meta/
│   └── main.yml
├── tasks/
│   ├── main.yml
│   ├── apache.yml
│   ├── mysql.yml
│   └── php.yml
├── templates/
│   ├── vhost.conf.j2
│   └── php.ini.j2
├── tests/
│   ├── inventory
│   └── test.yml
└── vars/
    └── main.yml
```

**`tasks/main.yml`**:

```yaml
---
- name: Include Apache tasks
  include_tasks: apache.yml
  tags: [apache]

- name: Include MySQL tasks
  include_tasks: mysql.yml
  tags: [mysql]

- name: Include PHP tasks
  include_tasks: php.yml
  tags: [php]
```

**`tasks/apache.yml`**:

```yaml
---
- name: Install Apache
  apt:
    name: apache2
    state: present

- name: Deploy virtual host config
  template:
    src: vhost.conf.j2
    dest: /etc/apache2/sites-available/{{ domain }}.conf
  notify: Restart Apache

- name: Enable site
  command: a2ensite {{ domain }}.conf
  notify: Restart Apache

- name: Start and enable Apache
  service:
    name: apache2
    state: started
    enabled: yes
```

### Jinja2 Template for Config File

```jinja2
{# templates/app.conf.j2 #}
# Managed by Ansible — do not edit manually
# Generated on {{ ansible_date_time.iso8601 }}

[application]
name = {{ app_name }}
environment = {{ env | default('production') }}
debug = {{ debug_mode | default('false') | lower }}

[database]
host = {{ db_host }}
port = {{ db_port | default(5432) }}
name = {{ db_name }}
user = {{ db_user }}
password = {{ db_password }}
pool_size = {{ db_pool_size | default(10) }}

[cache]
{% if cache_enabled %}
backend = redis
host = {{ cache_host }}
port = {{ cache_port | default(6379) }}
ttl = {{ cache_ttl | default(300) }}
{% else %}
backend = none
{% endif %}

[logging]
level = {{ log_level | upper }}
file = /var/log/{{ app_name }}/app.log
max_size = {{ log_max_size | default('100MB') }}
```

### Using Vault to Encrypt Secrets

```bash
# Create a vault-encrypted variables file
ansible-vault create group_vars/production/vault.yml
```

```yaml
# group_vars/production/vault.yml (before encryption)
vault_db_password: "S3cur3P@ssw0rd!"
vault_api_key: "ak-1234567890abcdef"
vault_ssl_passphrase: "my-ssl-pass"
```

```yaml
# group_vars/production/vars.yml (references vault vars)
db_password: "{{ vault_db_password }}"
api_key: "{{ vault_api_key }}"
ssl_passphrase: "{{ vault_ssl_passphrase }}"
```

```yaml
# Playbook using vault secrets
---
- name: Deploy with secrets
  hosts: production
  become: yes

  tasks:
    - name: Configure database
      template:
        src: db.conf.j2
        dest: /etc/myapp/db.conf
        mode: '0600'
```

```bash
# Run with vault
ansible-playbook deploy.yml --vault-password-file ~/.vault_pass
```

### Dynamic Inventory Script (AWS EC2)

**`aws_ec2.yml`** (inventory plugin config):

```yaml
---
plugin: amazon.aws.aws_ec2
regions:
  - us-east-1
  - us-west-2
filters:
  tag:Environment:
    - production
    - staging
  instance-state-name: running
keyed_groups:
  - key: tags.Environment
    prefix: env
  - key: instance_type
    prefix: instance_type
  - key: placement.region
    prefix: region
hostnames:
  - private-ip-address
compose:
  ansible_host: private_ip_address
```

```bash
# Test dynamic inventory
ansible-inventory -i aws_ec2.yml --list
ansible-inventory -i aws_ec2.yml --graph
```

### Handler Usage

```yaml
---
- name: Configure application
  hosts: appservers
  become: yes

  tasks:
    - name: Update app config
      template:
        src: app.conf.j2
        dest: /etc/myapp/app.conf
      notify:
        - Validate config
        - Restart app

    - name: Update logging config
      copy:
        src: logging.yml
        dest: /etc/myapp/logging.yml
      notify: Restart app

  handlers:
    - name: Validate config
      command: /usr/bin/myapp --validate-config
      listen: "Validate config"

    - name: Restart app
      service:
        name: myapp
        state: restarted
      listen: "Restart app"
```

### Loop Examples

```yaml
---
- name: Loop examples
  hosts: all
  become: yes

  tasks:
    # Simple loop
    - name: Install packages
      apt:
        name: "{{ item }}"
        state: present
      loop:
        - nginx
        - git
        - htop
        - curl

    # Loop with index
    - name: Create numbered files
      file:
        path: "/tmp/file_{{ index }}"
        state: touch
      loop: "{{ range(1, 6) | list }}"
      loop_control:
        loop_var: index

    # Nested loop with subelements
    - name: Add users to groups
      user:
        name: "{{ item.0.name }}"
        groups: "{{ item.1 }}"
        append: yes
      loop: "{{ users | subelements('groups') }}"

    # Loop with conditionals
    - name: Start services if enabled
      service:
        name: "{{ item.name }}"
        state: started
      loop:
        - { name: 'nginx', enabled: true }
        - { name: 'redis', enabled: false }
        - { name: 'postgres', enabled: true }
      when: item.enabled
```

### Conditional Tasks

```yaml
---
- name: Conditional examples
  hosts: all
  become: yes

  tasks:
    - name: Install on Ubuntu
      apt:
        name: nginx
      when: ansible_distribution == "Ubuntu"

    - name: Install on CentOS
      yum:
        name: nginx
      when: ansible_distribution == "CentOS"

    - name: Run only in production
      template:
        src: prod.conf.j2
        dest: /etc/app/prod.conf
      when: env == "production"

    - name: Check if file exists
      stat:
        path: /etc/app/config.yml
      register: config_file

    - name: Create config if missing
      template:
        src: config.yml.j2
        dest: /etc/app/config.yml
      when: not config_file.stat.exists
```

---

## 4. Cheat Sheet

### CLI Commands Quick Reference

| Command | Description | Common Flags |
|---------|-------------|--------------|
| `ansible` | Run ad-hoc commands | `-m` (module), `-a` (args), `-i` (inventory), `-b` (become), `-f` (forks) |
| `ansible-playbook` | Execute playbooks | `--check` (dry run), `--diff`, `--limit`, `--tags`, `--skip-tags`, `-e` (extra vars) |
| `ansible-galaxy` | Manage roles and collections | `init`, `install`, `list`, `remove`, `search` |
| `ansible-vault` | Encrypt/decrypt data | `create`, `encrypt`, `decrypt`, `edit`, `view`, `rekey` |
| `ansible-doc` | Module documentation | `-l` (list), `-s` (snippet), `-t` (type: module, callback, lookup) |
| `ansible-inventory` | Display inventory info | `--list`, `--graph`, `--host` |
| `ansible-config` | Manage configuration | `list`, `dump`, `view`, `init` |

### Essential Command Examples

```bash
# --- ansible ---
ansible all -m ping
ansible webservers -m shell -a "uptime" -f 20
ansible all -m setup --tree /tmp/facts

# --- ansible-playbook ---
ansible-playbook site.yml
ansible-playbook site.yml --check --diff          # Dry run with diff
ansible-playbook site.yml --limit webservers       # Limit to group
ansible-playbook site.yml --tags deploy            # Run tagged tasks
ansible-playbook site.yml -e "version=2.0"         # Extra variables
ansible-playbook site.yml --start-at-task "Deploy"  # Start at specific task
ansible-playbook site.yml --step                    # Step through tasks

# --- ansible-galaxy ---
ansible-galaxy init my_role
ansible-galaxy install -r requirements.yml
ansible-galaxy collection install community.general

# --- ansible-vault ---
ansible-vault create secrets.yml
ansible-vault encrypt_string 'password123' --name 'db_pass'
ansible-vault rekey secrets.yml

# --- ansible-doc ---
ansible-doc apt
ansible-doc -l | grep aws
ansible-doc -s template

# --- ansible-inventory ---
ansible-inventory -i inventory/ --graph
ansible-inventory -i inventory/ --list --yaml

# --- ansible-config ---
ansible-config dump --only-changed
ansible-config view
```

### ansible.cfg Priority Order

1. `ANSIBLE_CONFIG` (environment variable)
2. `./ansible.cfg` (current directory)
3. `~/.ansible.cfg` (home directory)
4. `/etc/ansible/ansible.cfg` (global)

### Common ansible.cfg Settings

```ini
[defaults]
inventory = ./inventory/hosts
remote_user = deploy
host_key_checking = False
forks = 20
timeout = 30
log_path = ./ansible.log
roles_path = ./roles
retry_files_enabled = False
stdout_callback = yaml

[privilege_escalation]
become = True
become_method = sudo
become_user = root
become_ask_pass = False

[ssh_connection]
pipelining = True
ssh_args = -o ControlMaster=auto -o ControlPersist=60s
```

---

## 5. Hands-on Labs

### Lab 1: Install and Configure Nginx with Custom Index Page

**Objective:** Write a playbook that installs Nginx, deploys a custom index page, and ensures the service is running.

```yaml
# lab1-nginx.yml
---
- name: "Lab 1: Nginx Setup with Custom Index"
  hosts: webservers
  become: yes
  vars:
    app_name: "My DevOps App"
    http_port: 80

  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: present
        update_cache: yes

    - name: Create custom index page
      copy:
        content: |
          <!DOCTYPE html>
          <html>
          <head><title>{{ app_name }}</title></head>
          <body>
            <h1>Welcome to {{ app_name }}</h1>
            <p>Server: {{ ansible_hostname }}</p>
            <p>IP: {{ ansible_default_ipv4.address }}</p>
            <p>OS: {{ ansible_distribution }} {{ ansible_distribution_version }}</p>
          </body>
          </html>
        dest: /var/www/html/index.html
        owner: www-data
        group: www-data
        mode: '0644'

    - name: Ensure Nginx is started and enabled
      service:
        name: nginx
        state: started
        enabled: yes

    - name: Verify Nginx is responding
      uri:
        url: "http://localhost:{{ http_port }}"
        status_code: 200
      register: result
      retries: 3
      delay: 5

    - name: Show verification result
      debug:
        msg: "Nginx is running — HTTP {{ result.status }}"
```

```bash
ansible-playbook lab1-nginx.yml -i inventory/hosts
```

---

### Lab 2: Create a Reusable Role for a LAMP Stack

**Objective:** Build a role that installs Apache, MySQL, and PHP.

```bash
ansible-galaxy init roles/lamp_stack
```

**`roles/lamp_stack/defaults/main.yml`**:

```yaml
---
mysql_root_password: "changeme"
php_version: "8.1"
apache_port: 80
domain: "example.com"
doc_root: "/var/www/{{ domain }}"
```

**`roles/lamp_stack/tasks/main.yml`**:

```yaml
---
- import_tasks: apache.yml
- import_tasks: mysql.yml
- import_tasks: php.yml
```

**`roles/lamp_stack/tasks/apache.yml`**:

```yaml
---
- name: Install Apache
  apt:
    name: apache2
    state: present

- name: Create document root
  file:
    path: "{{ doc_root }}"
    state: directory
    owner: www-data
    group: www-data

- name: Deploy vhost config
  template:
    src: vhost.conf.j2
    dest: "/etc/apache2/sites-available/{{ domain }}.conf"
  notify: Restart Apache

- name: Enable site
  shell: "a2ensite {{ domain }}.conf && a2dissite 000-default.conf"
  notify: Restart Apache

- name: Start Apache
  service:
    name: apache2
    state: started
    enabled: yes
```

**`roles/lamp_stack/tasks/mysql.yml`**:

```yaml
---
- name: Install MySQL
  apt:
    name:
      - mysql-server
      - python3-mysqldb
    state: present

- name: Start MySQL
  service:
    name: mysql
    state: started
    enabled: yes

- name: Set MySQL root password
  mysql_user:
    name: root
    password: "{{ mysql_root_password }}"
    host: localhost
    login_unix_socket: /var/run/mysqld/mysqld.sock
```

**`roles/lamp_stack/handlers/main.yml`**:

```yaml
---
- name: Restart Apache
  service:
    name: apache2
    state: restarted
```

**Using the role:**

```yaml
# site.yml
---
- name: Deploy LAMP Stack
  hosts: webservers
  become: yes
  roles:
    - role: lamp_stack
      vars:
        domain: "myapp.com"
        mysql_root_password: "{{ vault_mysql_root_password }}"
```

---

### Lab 3: Ansible Vault for Secrets Management

**Objective:** Encrypt and manage secrets with Ansible Vault.

```bash
# Step 1: Create vault password file
echo 'MyVaultP@ss2024' > ~/.vault_pass
chmod 600 ~/.vault_pass

# Step 2: Create encrypted secrets file
ansible-vault create --vault-password-file ~/.vault_pass group_vars/production/vault.yml
```

```yaml
# group_vars/production/vault.yml (content to encrypt)
vault_db_password: "Pr0duction_DB_P@ss!"
vault_api_secret: "sk-abc123def456ghi789"
vault_ssl_key_passphrase: "ssl-key-pass-2024"
```

```yaml
# group_vars/production/vars.yml
db_password: "{{ vault_db_password }}"
api_secret: "{{ vault_api_secret }}"
```

```yaml
# lab3-secrets.yml
---
- name: "Lab 3: Deploy with Vault Secrets"
  hosts: production
  become: yes

  tasks:
    - name: Deploy database config with secrets
      template:
        src: db.conf.j2
        dest: /etc/myapp/db.conf
        mode: '0600'
        owner: appuser

    - name: Encrypt string inline
      debug:
        msg: "DB connection is configured"
```

```bash
# Encrypt a single string
ansible-vault encrypt_string --vault-password-file ~/.vault_pass \
  'MyS3cretValue' --name 'my_secret'

# Run playbook
ansible-playbook lab3-secrets.yml --vault-password-file ~/.vault_pass
```

---

### Lab 4: Dynamic Inventory with AWS

**Objective:** Set up dynamic inventory using the AWS EC2 plugin.

```bash
# Install required collection
ansible-galaxy collection install amazon.aws
pip install boto3 botocore
```

```yaml
# inventory/aws_ec2.yml
---
plugin: amazon.aws.aws_ec2
aws_profile: production
regions:
  - us-east-1
filters:
  tag:ManagedBy: Ansible
  instance-state-name: running
keyed_groups:
  - key: tags.Role
    prefix: role
  - key: tags.Environment
    prefix: env
  - key: placement.availability_zone
    prefix: az
hostnames:
  - tag:Name
  - private-ip-address
compose:
  ansible_host: private_ip_address
  ansible_user: "'ubuntu'"
```

```bash
# Verify inventory
ansible-inventory -i inventory/aws_ec2.yml --graph
ansible-inventory -i inventory/aws_ec2.yml --list

# Use in playbook
ansible-playbook -i inventory/aws_ec2.yml site.yml
```

---

## 6. Real-world Scenarios

### Scenario 1: Configure 50 Servers Consistently with Roles

**Problem:** Maintain consistent configurations across 50 servers of different roles (web, app, db).

```yaml
# site.yml — master playbook
---
- name: Apply base configuration to all servers
  hosts: all
  become: yes
  roles:
    - common        # SSH hardening, NTP, monitoring agent, users
    - security      # Firewall rules, fail2ban, sysctl tuning

- name: Configure web servers
  hosts: webservers
  become: yes
  roles:
    - nginx
    - certbot

- name: Configure app servers
  hosts: appservers
  become: yes
  roles:
    - java
    - app_deploy

- name: Configure database servers
  hosts: dbservers
  become: yes
  roles:
    - postgresql
    - backup
```

```ini
# ansible.cfg
[defaults]
forks = 25
strategy = free
pipelining = True
```

```bash
# Deploy with parallelism
ansible-playbook site.yml -f 25

# Check mode first
ansible-playbook site.yml --check --diff
```

---

### Scenario 2: Rolling Updates with Zero Downtime

**Problem:** Deploy application updates across web servers without downtime.

```yaml
---
- name: Rolling update — zero downtime
  hosts: webservers
  become: yes
  serial: "25%"          # Update 25% of hosts at a time
  max_fail_percentage: 0  # Abort if any host fails

  pre_tasks:
    - name: Remove from load balancer
      uri:
        url: "http://{{ lb_host }}/api/deregister"
        method: POST
        body: '{"host": "{{ inventory_hostname }}"}'
        body_format: json

    - name: Wait for connections to drain
      wait_for:
        timeout: 30

  tasks:
    - name: Pull latest application code
      git:
        repo: "{{ app_repo }}"
        dest: "{{ app_dir }}"
        version: "{{ app_version }}"

    - name: Install dependencies
      pip:
        requirements: "{{ app_dir }}/requirements.txt"
        virtualenv: "{{ app_dir }}/venv"

    - name: Run database migrations
      command: "{{ app_dir }}/venv/bin/python manage.py migrate"
      args:
        chdir: "{{ app_dir }}"
      run_once: true

    - name: Restart application
      systemd:
        name: myapp
        state: restarted

    - name: Health check
      uri:
        url: "http://localhost:{{ app_port }}/health"
        status_code: 200
      register: health
      retries: 5
      delay: 10
      until: health.status == 200

  post_tasks:
    - name: Re-register with load balancer
      uri:
        url: "http://{{ lb_host }}/api/register"
        method: POST
        body: '{"host": "{{ inventory_hostname }}"}'
        body_format: json
```

---

### Scenario 3: Secrets Rotation Across All Environments

**Problem:** Rotate database passwords and API keys across dev, staging, production.

```yaml
---
- name: Rotate secrets across environments
  hosts: all
  become: yes
  vars_files:
    - "vault/{{ env }}.yml"

  tasks:
    - name: Generate new password
      set_fact:
        new_db_password: "{{ lookup('password', '/dev/null length=24 chars=ascii_letters,digits,punctuation') }}"
      run_once: true
      delegate_to: localhost

    - name: Update database password
      mysql_user:
        name: "{{ db_user }}"
        password: "{{ new_db_password }}"
        host: "%"
        login_user: root
        login_password: "{{ vault_mysql_root_password }}"
      when: "'dbservers' in group_names"

    - name: Update application config
      template:
        src: db.conf.j2
        dest: /etc/myapp/db.conf
        mode: '0600'
      notify: Restart application

    - name: Update vault with new password
      local_action:
        module: copy
        content: "vault_db_password: {{ new_db_password }}"
        dest: "vault/{{ env }}_new.yml"
      run_once: true

    - name: Verify application connectivity
      uri:
        url: "http://localhost:{{ app_port }}/health"
        status_code: 200
      retries: 3
      delay: 5

  handlers:
    - name: Restart application
      service:
        name: myapp
        state: restarted
```

---

## 7. Interview Q&A

### Basic (Q1–Q15)

**Q1:** What is Ansible and why is it used?

> Ansible is an open-source automation tool for configuration management, application deployment, and orchestration. It uses an agentless, push-based architecture communicating over SSH, making it simple to set up and use without installing software on managed nodes.

**Q2:** What is the difference between Ansible and other configuration management tools like Puppet and Chef?

> Ansible is **agentless** (uses SSH), **push-based**, and uses **YAML** for configuration. Puppet uses a **pull-based** model with agents and its own DSL. Chef is also pull-based with agents and uses **Ruby**. Ansible has the lowest learning curve and simplest setup.

**Q3:** What is an Ansible Playbook?

> A playbook is a YAML file that defines a set of plays. Each play maps a group of hosts to tasks (module calls) that are executed in order. Playbooks are the main way to orchestrate complex automation workflows.

**Q4:** What is an Ansible Inventory?

> An inventory is a file or script that defines the hosts and groups Ansible manages. Static inventories are INI or YAML files. Dynamic inventories are scripts or plugins that pull host information from external sources like AWS, Azure, or a CMDB.

**Q5:** Explain idempotency in Ansible.

> Idempotency means running a playbook multiple times produces the same result without side effects. Ansible modules check the current state before making changes — if the desired state already exists, no action is taken. For example, `apt: name=nginx state=present` won't reinstall Nginx if it's already installed.

**Q6:** What is an Ansible Module?

> A module is a unit of code that Ansible runs on managed nodes to perform specific tasks (install packages, copy files, manage services). Ansible ships with thousands of built-in modules and supports custom modules written in Python or any language.

**Q7:** What is the difference between `command` and `shell` modules?

> The `command` module executes commands without a shell, so features like pipes (`|`), redirects (`>`), and environment variables don't work. The `shell` module runs commands through `/bin/sh`, supporting all shell features. `command` is more secure as it avoids shell injection risks.

**Q8:** What are Ansible Facts?

> Facts are system properties gathered automatically from managed nodes at the start of a play (via `setup` module). They include hostname, IP addresses, OS, memory, CPU, etc. Access them as variables like `ansible_os_family`, `ansible_hostname`. Disable with `gather_facts: no`.

**Q9:** How do you define variables in Ansible?

> Variables can be defined in: inventory files, `group_vars/` and `host_vars/` directories, playbook `vars:` section, `vars_files`, role `defaults/` and `vars/`, registered variables, facts, and command-line extra vars (`-e`). Extra vars have the highest precedence.

**Q10:** What is the purpose of `handlers` in Ansible?

> Handlers are tasks that only run when notified by other tasks using the `notify` keyword. They typically restart or reload services after configuration changes. Handlers run once at the end of a play, regardless of how many tasks notify them.

**Q11:** What is Ansible Galaxy?

> Ansible Galaxy is a public repository for sharing Ansible roles and collections. You can download community roles with `ansible-galaxy install`, create role skeletons with `ansible-galaxy init`, and manage dependencies via `requirements.yml`.

**Q12:** How do you check playbook syntax without executing it?

> Use `ansible-playbook --syntax-check site.yml` to validate YAML syntax. Use `--check` (dry run mode) to simulate execution and `--diff` to show proposed file changes without actually applying them.

**Q13:** What is `become` in Ansible?

> `become` is the privilege escalation mechanism. Setting `become: yes` runs tasks with elevated privileges (default: `sudo` as `root`). You can customize with `become_user`, `become_method` (sudo, su, pbrun), and `become_ask_pass`.

**Q14:** How does Ansible connect to managed nodes?

> Ansible uses **SSH** for Linux/Unix nodes and **WinRM** for Windows nodes. It supports key-based authentication (recommended), password authentication, and SSH agent forwarding. Connection parameters are configured in inventory or `ansible.cfg`.

**Q15:** What file format does Ansible use for playbooks?

> YAML (YAML Ain't Markup Language). Playbooks use `.yml` or `.yaml` extensions. YAML uses indentation (spaces, not tabs) for structure, hyphens for lists, and colons for key-value pairs.

---

### Intermediate (Q16–Q35)

**Q16:** Explain the difference between `include_tasks` and `import_tasks`.

> `import_tasks` is **static** — tasks are pre-processed at playbook parse time (supports `--list-tasks`, tags apply to all imported tasks). `include_tasks` is **dynamic** — tasks are processed at runtime (supports loops, conditionals on the include itself, but tasks aren't visible in `--list-tasks`).

**Q17:** What are Ansible Roles and why use them?

> Roles are a standardized directory structure for organizing playbooks into reusable components. They separate tasks, handlers, variables, templates, and files into dedicated directories. Roles promote code reuse, maintainability, and sharing via Galaxy.

**Q18:** How does Ansible Vault work?

> Ansible Vault encrypts sensitive data (passwords, keys) using AES-256 symmetric encryption. You can encrypt entire files (`ansible-vault encrypt`) or inline strings (`encrypt_string`). Decrypt at runtime by providing the vault password via `--ask-vault-pass` or `--vault-password-file`.

**Q19:** What is a Jinja2 template in Ansible?

> Jinja2 is the templating engine Ansible uses for dynamic content. Templates (`.j2` files) contain variables (`{{ var }}`), conditionals (`{% if %}`), loops (`{% for %}`), and filters (`{{ var | upper }}`). The `template` module renders and deploys them to managed nodes.

**Q20:** Explain Ansible variable precedence.

> Ansible has 22 levels of variable precedence. Key levels from lowest to highest: role defaults → inventory vars → group_vars → host_vars → play vars → role vars → task vars → extra vars (`-e`). Extra vars always win. Understanding precedence prevents unexpected value overrides.

**Q21:** How do you handle errors in Ansible playbooks?

> Use `ignore_errors: yes` to continue on failure, `failed_when` to define custom failure conditions, `block/rescue/always` for try-catch-finally logic, `any_errors_fatal: true` to abort on any host failure, and `retries`/`until` for retry logic on flaky tasks.

```yaml
- block:
    - name: Attempt risky operation
      command: /usr/bin/risky-command
  rescue:
    - name: Handle failure
      debug:
        msg: "Operation failed, rolling back"
  always:
    - name: Always clean up
      file:
        path: /tmp/lockfile
        state: absent
```

**Q22:** What is the `serial` keyword?

> `serial` controls batch size for rolling updates. Instead of running on all hosts simultaneously, `serial: 2` processes 2 hosts at a time, `serial: "25%"` processes 25% of hosts. This enables zero-downtime deployments by keeping some hosts serving traffic.

**Q23:** How do you use dynamic inventory?

> Dynamic inventory pulls host information from external sources at runtime. Configure an inventory plugin (e.g., `aws_ec2.yml`) or write a custom script that outputs JSON. Use with `-i inventory_plugin.yml`. Supports AWS, Azure, GCP, VMware, OpenStack, and custom sources.

**Q24:** What are Ansible Collections?

> Collections are a packaging format (introduced in Ansible 2.9+) that bundles modules, plugins, roles, and playbooks into a distributable unit. Install with `ansible-galaxy collection install namespace.name`. Collections live in `~/.ansible/collections/` or project-local paths.

**Q25:** How do you debug Ansible playbooks?

> Use `debug` module to print variables, `-v`/`-vvv`/`-vvvv` for increasing verbosity, `--step` to execute task-by-task interactively, `--start-at-task` to resume from a specific task, `register` to capture output, and the `debugger` keyword to drop into an interactive debugger on failure.

**Q26:** What is `delegate_to` and when would you use it?

> `delegate_to` runs a task on a different host than the current play target. Use cases: running a command on localhost (like API calls to a load balancer), updating DNS from a DNS server, or taking a host out of a pool from the load balancer. The task still uses the original host's variables.

**Q27:** Explain Ansible Tags.

> Tags label tasks so you can selectively run or skip them. Apply with `tags: [deploy, config]`. Run with `--tags deploy` or skip with `--skip-tags config`. Special tags: `always` (runs unless explicitly skipped), `never` (skipped unless explicitly included). Tags help speed up partial runs.

**Q28:** What is `ansible-pull` and how does it differ from `ansible-playbook`?

> `ansible-pull` inverts the default push model — managed nodes pull and execute playbooks from a Git repository. Useful for auto-scaling environments where new nodes configure themselves. Typically set up as a cron job. Trades centralized control for scalability.

**Q29:** How do you manage multiple environments (dev, staging, prod)?

> Use separate inventory files per environment (`inventory/dev`, `inventory/prod`), `group_vars/` per environment for variables, vault-encrypted secrets per environment, and run with `-i inventory/production`. Alternatively, use a single inventory with groups and conditional logic.

**Q30:** What are callback plugins?

> Callback plugins customize Ansible's output and behavior. Built-in examples: `yaml` (YAML-formatted output), `json`, `timer` (execution timing), `profile_tasks` (per-task timing). Configure in `ansible.cfg` under `stdout_callback`. Custom plugins can send data to monitoring systems, Slack, etc.

**Q31:** Explain `register` and how to use registered variables.

> `register` captures the output of a task into a variable. The variable contains `stdout`, `stderr`, `rc` (return code), `changed`, `failed`, etc. Use it in subsequent tasks with `when`, `debug`, or `failed_when` to make decisions based on task results.

**Q32:** What is the difference between `state: present` and `state: latest`?

> `state: present` ensures a package is installed (any version). `state: latest` ensures the newest version is installed, upgrading if a newer version is available. Use `present` for stability and predictability; use `latest` only when you explicitly want updates.

**Q33:** How do you run a task only once across all hosts?

> Use `run_once: true` to execute a task on only the first host in the batch. Commonly used for database migrations, API calls, or any operation that should happen once. Combine with `delegate_to: localhost` for local-only tasks.

**Q34:** What is `check_mode` (dry run)?

> `check_mode` (`--check`) simulates playbook execution without making changes. Modules report what would change. Not all modules support check mode. Use `check_mode: no` on specific tasks to force execution even in check mode (e.g., gathering information needed for subsequent checks).

**Q35:** How do you pass variables at runtime?

> Use extra vars: `ansible-playbook site.yml -e "version=2.0 env=prod"`, use `vars_prompt` for interactive input, `vars_files` for external variable files, or `set_fact` to create variables dynamically during execution. Extra vars (`-e`) have the highest precedence.

---

### Advanced (Q36–Q50)

**Q36:** How do you optimize Ansible performance for large infrastructures?

> Key optimizations: increase `forks` (default 5 → 50+), enable `pipelining = True` in SSH settings, use `strategy: free` for independent tasks, disable `gather_facts` when not needed, use `async` for long-running tasks, enable SSH multiplexing (`ControlPersist`), and use `mitogen` strategy plugin for 2-7x speedups.

```ini
[defaults]
forks = 50
strategy = free

[ssh_connection]
pipelining = True
ssh_args = -o ControlMaster=auto -o ControlPersist=60s
```

**Q37:** Explain async tasks and polling in Ansible.

> `async` runs long tasks in the background with a timeout. `poll: 0` means fire-and-forget. `poll: N` checks every N seconds. Use `async_status` to check later. Useful for operations that exceed SSH timeout or when parallelizing across hosts.

```yaml
- name: Long-running task
  command: /opt/run_migration.sh
  async: 3600    # Max runtime: 1 hour
  poll: 0        # Don't wait
  register: migration_job

- name: Check migration status
  async_status:
    jid: "{{ migration_job.ansible_job_id }}"
  register: result
  until: result.finished
  retries: 60
  delay: 60
```

**Q38:** How do you write a custom Ansible module?

> Custom modules are scripts (typically Python) placed in `library/` directory. They receive JSON input, perform actions, and return JSON output with `changed`, `failed`, and optional `msg` fields. Use `AnsibleModule` from `ansible.module_utils.basic` for argument parsing and exit handling.

```python
#!/usr/bin/python
from ansible.module_utils.basic import AnsibleModule

def main():
    module = AnsibleModule(
        argument_spec=dict(
            name=dict(type='str', required=True),
            state=dict(type='str', default='present', choices=['present', 'absent']),
        )
    )
    name = module.params['name']
    # ... custom logic ...
    module.exit_json(changed=True, msg=f"Resource {name} configured")

if __name__ == '__main__':
    main()
```

**Q39:** What are strategy plugins and which ones are available?

> Strategy plugins control task execution order. **linear** (default): all hosts complete each task before moving on. **free**: each host runs independently as fast as possible. **host_pinned**: like free but keeps a host locked to a worker. **debug**: interactive debugging. Third-party: **mitogen** for high performance.

**Q40:** Explain Ansible AWX/Tower architecture and its benefits over CLI.

> AWX/Tower provides: web UI for playbook execution, **RBAC** (role-based access control), **job scheduling**, **credential management** (no plaintext passwords), **audit trails** and logging, REST API for integration, **workflow templates** (chain multiple playbooks), real-time job output, **inventory sync** from cloud providers, and **notifications** (Slack, email).

**Q41:** How do you implement CI/CD with Ansible?

> Integrate Ansible into CI/CD by: running `ansible-lint` in CI for code quality, executing playbooks from Jenkins/GitLab CI pipelines, using `--check --diff` in PR checks, automating deployments with AWX/Tower API, storing playbooks in Git with code review, and using Molecule for role testing.

**Q42:** What is Molecule and how is it used for testing?

> Molecule is a testing framework for Ansible roles. It creates test instances (Docker, Vagrant, cloud), runs your role, and verifies the result. Supports linting (yamllint, ansible-lint), syntax checking, idempotence testing, and verification with Testinfra or Ansible itself.

```bash
molecule init role my_role --driver-name docker
molecule test    # Full test cycle: create → converge → verify → destroy
```

**Q43:** How do you handle secrets rotation at scale with Ansible?

> Use Vault for encrypted vars, integrate with HashiCorp Vault via `hashi_vault` lookup plugin, use AWX credential management, implement rotation playbooks with `serial` for rolling updates, store vault passwords in a secrets manager (not files), and use `no_log: true` to prevent secrets in logs.

**Q44:** Explain `lookup` plugins with examples.

> Lookup plugins fetch data from external sources. They run on the **control node**.

```yaml
# File content
password: "{{ lookup('file', '/etc/secrets/db_pass') }}"

# Environment variable
home: "{{ lookup('env', 'HOME') }}"

# Password generation
new_pass: "{{ lookup('password', '/dev/null length=20') }}"

# HashiCorp Vault
secret: "{{ lookup('hashi_vault', 'secret=myapp/data/db:password') }}"

# DNS
ip: "{{ lookup('dig', 'example.com') }}"
```

**Q45:** How do you implement network automation with Ansible?

> Ansible supports network devices via specialized modules (`ios_config`, `nxos_command`, `junos_config`). Use `connection: network_cli` or `connection: netconf` instead of SSH. Ansible Network Resource Modules provide a declarative interface for managing interfaces, VLANs, ACLs, and routing.

**Q46:** What is `ansible-lint` and what rules does it enforce?

> `ansible-lint` is a linting tool that checks playbooks for best practices: no use of `command`/`shell` when a module exists, proper naming conventions, no deprecated syntax, no hardcoded passwords, YAML formatting, task naming requirements, and idempotency violations. Integrate in CI pipelines.

**Q47:** How do you handle Ansible in a multi-team enterprise environment?

> Use AWX/Tower for RBAC and audit trails, organize with collections per team, use separate inventories per environment, enforce `ansible-lint` in CI, implement Git branching strategy for playbooks, use Vault for secrets management, establish a shared roles repository, and document conventions.

**Q48:** Explain the `filter` plugins and custom filters.

> Filters transform data in Jinja2 expressions. Built-in: `default()`, `upper`, `lower`, `regex_replace`, `to_json`, `to_yaml`, `combine` (merge dicts), `map`, `select`, `reject`, `ipaddr`. Custom filters are Python functions placed in `filter_plugins/` directory.

```yaml
# Examples
ip: "{{ my_ip | ipaddr('network') }}"
merged: "{{ dict1 | combine(dict2) }}"
filtered: "{{ users | selectattr('active', 'equalto', true) | list }}"
encoded: "{{ 'hello' | b64encode }}"
```

**Q49:** How do you manage Windows hosts with Ansible?

> Windows nodes use **WinRM** (not SSH). Install `pywinrm` on the control node. Use Windows-specific modules: `win_command`, `win_shell`, `win_copy`, `win_service`, `win_package`, `win_feature`, `win_dsc`. Configure WinRM listener on Windows and set `ansible_connection: winrm` in inventory.

**Q50:** Describe a production-grade Ansible project structure.

> A well-organized project:

```
ansible-project/
├── ansible.cfg
├── site.yml                 # Master playbook
├── webservers.yml           # Play for webservers
├── dbservers.yml            # Play for dbservers
├── inventory/
│   ├── production/
│   │   ├── hosts            # Production inventory
│   │   ├── group_vars/
│   │   │   ├── all.yml
│   │   │   ├── webservers.yml
│   │   │   └── vault.yml   # Encrypted secrets
│   │   └── host_vars/
│   │       └── web1.yml
│   └── staging/
│       ├── hosts
│       └── group_vars/
├── roles/
│   ├── common/              # Base role for all servers
│   ├── nginx/               # Nginx role
│   ├── postgresql/          # PostgreSQL role
│   └── app_deploy/          # Application deployment
├── library/                 # Custom modules
├── filter_plugins/          # Custom filters
├── callback_plugins/        # Custom callbacks
├── templates/               # Global templates
├── files/                   # Global static files
├── group_vars/              # Global group variables
├── host_vars/               # Global host variables
├── requirements.yml         # Galaxy role dependencies
└── Makefile                 # Common commands
```

> This structure separates environments, uses roles for reusability, encrypts secrets with Vault, supports custom plugins, and integrates with Galaxy for dependency management. Each role is independently testable with Molecule.

---

*End of Ansible DevOps Interview Notes*
