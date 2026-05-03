---
title: Shell Scripting Notes
layout: default
render_with_liquid: false
---
# 📜 Shell Scripting – DevOps Notes

---

## 1. Introduction

Shell scripting automates repetitive tasks, system administration, deployments, and monitoring in DevOps. Bash (Bourne Again Shell) is the most common shell on Linux systems.

### Why Shell Scripting for DevOps?
- Automate server provisioning and configuration
- Build CI/CD pipeline scripts
- Create monitoring and alerting scripts
- Log analysis and reporting
- Backup and disaster recovery automation

---

## 2. Basics

### Shebang & Execution
```bash
#!/bin/bash
# Shebang line tells the system which interpreter to use

# Make executable
chmod +x script.sh

# Run
./script.sh
bash script.sh
source script.sh    # Runs in current shell (imports variables)
```

### Variables
```bash
#!/bin/bash

# Declaration (no spaces around =)
NAME="DevOps"
COUNT=42
READONLY_VAR="fixed"
readonly READONLY_VAR

# Usage
echo "Welcome to $NAME"
echo "Count is ${COUNT}"

# Command substitution
CURRENT_DATE=$(date +%Y-%m-%d)
HOSTNAME=$(hostname)
FILE_COUNT=$(ls /tmp | wc -l)

# Environment variables
export APP_ENV="production"
echo $HOME $USER $PATH $PWD $SHELL

# Special variables
echo $0    # Script name
echo $1    # First argument
echo $#    # Number of arguments
echo $@    # All arguments (as separate words)
echo $*    # All arguments (as single string)
echo $?    # Exit status of last command
echo $$    # Current process ID
echo $!    # PID of last background process
```

### String Operations
```bash
STR="Hello DevOps World"

echo ${#STR}              # Length: 18
echo ${STR:6}             # Substring from index 6: "DevOps World"
echo ${STR:6:6}           # Substring from 6, length 6: "DevOps"
echo ${STR/DevOps/SRE}    # Replace first: "Hello SRE World"
echo ${STR//o/0}          # Replace all: "Hell0 Dev0ps W0rld"
echo ${STR^^}             # Uppercase: "HELLO DEVOPS WORLD"
echo ${STR,,}             # Lowercase: "hello devops world"
echo ${STR#Hello }        # Remove prefix: "DevOps World"
echo ${STR%World}         # Remove suffix: "Hello DevOps "
```

---

## 3. Conditionals

### if / elif / else
```bash
#!/bin/bash

AGE=$1

if [ $AGE -lt 18 ]; then
    echo "Minor"
elif [ $AGE -ge 18 ] && [ $AGE -lt 65 ]; then
    echo "Adult"
else
    echo "Senior"
fi
```

### Test Operators

| Operator | Purpose |
|----------|---------|
| `-eq`, `-ne` | Equal, not equal (numbers) |
| `-gt`, `-lt` | Greater than, less than |
| `-ge`, `-le` | Greater/equal, less/equal |
| `==`, `!=` | String equal, not equal |
| `-z "$var"` | String is empty |
| `-n "$var"` | String is not empty |
| `-f file` | File exists and is regular file |
| `-d dir` | Directory exists |
| `-r file` | File is readable |
| `-w file` | File is writable |
| `-x file` | File is executable |
| `-s file` | File exists and is not empty |
| `-e path` | Path exists |

### File Checks
```bash
#!/bin/bash

CONFIG="/etc/myapp/config.yml"

if [ -f "$CONFIG" ]; then
    echo "Config found"
    source "$CONFIG"
elif [ -f "/etc/myapp/config.yml.default" ]; then
    echo "Using default config"
    cp /etc/myapp/config.yml.default "$CONFIG"
else
    echo "ERROR: No config found" >&2
    exit 1
fi
```

### Case Statement
```bash
#!/bin/bash

case "$1" in
    start)
        echo "Starting service..."
        systemctl start myapp
        ;;
    stop)
        echo "Stopping service..."
        systemctl stop myapp
        ;;
    restart)
        echo "Restarting service..."
        systemctl restart myapp
        ;;
    status)
        systemctl status myapp
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac
```

---

## 4. Loops

### For Loop
```bash
#!/bin/bash

# List iteration
for server in web01 web02 web03 db01; do
    echo "Checking $server..."
    ping -c 1 -W 2 "$server" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "  $server is UP"
    else
        echo "  $server is DOWN"
    fi
done

# Range
for i in {1..10}; do
    echo "Iteration $i"
done

# C-style
for ((i=0; i<5; i++)); do
    echo "Count: $i"
done

# File iteration
for file in /var/log/*.log; do
    echo "Processing: $file ($(wc -l < "$file") lines)"
done
```

### While Loop
```bash
#!/bin/bash

# Counter
COUNT=0
while [ $COUNT -lt 5 ]; do
    echo "Count: $COUNT"
    COUNT=$((COUNT + 1))
done

# Read file line by line
while IFS= read -r line; do
    echo "Line: $line"
done < /etc/hosts

# Infinite loop (for monitoring)
while true; do
    DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | tr -d '%')
    if [ "$DISK_USAGE" -gt 90 ]; then
        echo "ALERT: Disk usage at ${DISK_USAGE}%"
    fi
    sleep 60
done
```

### Until Loop
```bash
#!/bin/bash

# Wait for a service to start
until curl -s http://localhost:8080/health > /dev/null 2>&1; do
    echo "Waiting for service to start..."
    sleep 5
done
echo "Service is UP!"
```

---

## 5. Functions

```bash
#!/bin/bash

# Basic function
greet() {
    echo "Hello, $1!"
}
greet "DevOps Engineer"

# Function with return value
is_service_running() {
    local service_name=$1
    systemctl is-active "$service_name" > /dev/null 2>&1
    return $?
}

if is_service_running "nginx"; then
    echo "Nginx is running"
else
    echo "Nginx is NOT running"
fi

# Function with output capture
get_disk_usage() {
    local mount_point=${1:-/}
    df "$mount_point" | awk 'NR==2 {print $5}' | tr -d '%'
}
USAGE=$(get_disk_usage "/")
echo "Root disk usage: ${USAGE}%"

# Function with local variables
deploy_app() {
    local app_name=$1
    local version=$2
    local deploy_dir="/opt/${app_name}"

    echo "Deploying $app_name v$version to $deploy_dir..."
    mkdir -p "$deploy_dir"
    # ... deployment logic
    echo "Deployment complete"
}
deploy_app "myapp" "2.1.0"
```

---

## 6. Arrays

```bash
#!/bin/bash

# Indexed array
SERVERS=("web01" "web02" "web03" "db01" "db02")

echo "First: ${SERVERS[0]}"
echo "All: ${SERVERS[@]}"
echo "Count: ${#SERVERS[@]}"
echo "Indices: ${!SERVERS[@]}"

# Loop through array
for server in "${SERVERS[@]}"; do
    echo "Server: $server"
done

# Add / remove elements
SERVERS+=("cache01")
unset SERVERS[2]

# Associative array (Bash 4+)
declare -A SERVICE_PORTS
SERVICE_PORTS[web]=80
SERVICE_PORTS[api]=8080
SERVICE_PORTS[db]=5432

for svc in "${!SERVICE_PORTS[@]}"; do
    echo "$svc runs on port ${SERVICE_PORTS[$svc]}"
done
```

---

## 7. Input Handling & Argument Parsing

```bash
#!/bin/bash

# Using getopts
usage() {
    echo "Usage: $0 -e <environment> -v <version> [-d]"
    echo "  -e  Environment (dev/staging/prod)"
    echo "  -v  Version to deploy"
    echo "  -d  Dry run mode"
    exit 1
}

DRY_RUN=false

while getopts "e:v:dh" opt; do
    case $opt in
        e) ENVIRONMENT=$OPTARG ;;
        v) VERSION=$OPTARG ;;
        d) DRY_RUN=true ;;
        h) usage ;;
        *) usage ;;
    esac
done

# Validate required args
if [ -z "$ENVIRONMENT" ] || [ -z "$VERSION" ]; then
    echo "ERROR: Environment and version are required"
    usage
fi

echo "Deploying version $VERSION to $ENVIRONMENT (dry_run=$DRY_RUN)"

# User input
read -p "Are you sure? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo "Cancelled."
    exit 0
fi
```

---

## 8. Error Handling & Exit Codes

```bash
#!/bin/bash

# Exit codes: 0 = success, 1-255 = failure
# Common: 1 = general error, 2 = misuse, 126 = not executable, 127 = not found

# Strict mode (recommended for scripts)
set -euo pipefail
# -e: Exit on error
# -u: Treat unset variables as errors
# -o pipefail: Pipeline fails if any command fails

# Trap for cleanup
cleanup() {
    echo "Cleaning up temp files..."
    rm -f /tmp/deploy_lock
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT        # Run on script exit
trap cleanup ERR         # Run on error
trap 'echo "Interrupted!"; exit 1' INT TERM  # Ctrl+C / kill

# Error handling function
die() {
    echo "ERROR: $1" >&2
    exit "${2:-1}"
}

# Usage
TEMP_DIR=$(mktemp -d) || die "Failed to create temp directory"

# Check command exists
command -v docker >/dev/null 2>&1 || die "Docker is not installed"

# Retry logic
retry() {
    local max_attempts=$1
    local delay=$2
    shift 2
    local cmd="$@"
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        echo "Attempt $attempt/$max_attempts: $cmd"
        if eval "$cmd"; then
            return 0
        fi
        echo "Failed. Retrying in ${delay}s..."
        sleep "$delay"
        attempt=$((attempt + 1))
    done
    die "Command failed after $max_attempts attempts: $cmd"
}

retry 3 5 curl -s http://localhost:8080/health
```

---

## 9. Logging

```bash
#!/bin/bash

LOG_FILE="/var/log/deploy.log"

log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

log "INFO" "Deployment started"
log "INFO" "Environment: production"
log "WARN" "Disk usage above 80%"
log "ERROR" "Failed to connect to database"

# Redirect all output to log file
exec > >(tee -a "$LOG_FILE") 2>&1
```

---

## 10. Practical DevOps Scripts

### Backup Script
```bash
#!/bin/bash
set -euo pipefail

BACKUP_SRC="/opt/myapp/data"
BACKUP_DST="/backup"
RETENTION_DAYS=7
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DST}/backup_${TIMESTAMP}.tar.gz"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }

# Create backup
log "Starting backup of $BACKUP_SRC"
mkdir -p "$BACKUP_DST"
tar -czf "$BACKUP_FILE" -C "$(dirname "$BACKUP_SRC")" "$(basename "$BACKUP_SRC")"
log "Backup created: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"

# Cleanup old backups
log "Removing backups older than $RETENTION_DAYS days"
find "$BACKUP_DST" -name "backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

log "Backup complete"
```

### Server Health Check Script
```bash
#!/bin/bash
set -euo pipefail

SERVERS=("web01" "web02" "api01" "db01")
ALERT_EMAIL="ops@company.com"
REPORT=""

check_server() {
    local server=$1
    local status="OK"
    local details=""

    # Ping check
    if ! ping -c 1 -W 2 "$server" > /dev/null 2>&1; then
        status="DOWN"
        details="UNREACHABLE"
    else
        # SSH and check load
        LOAD=$(ssh -o ConnectTimeout=5 "$server" "uptime | awk -F'average:' '{print \$2}' | cut -d, -f1 | xargs" 2>/dev/null || echo "N/A")
        DISK=$(ssh -o ConnectTimeout=5 "$server" "df / | awk 'NR==2{print \$5}'" 2>/dev/null || echo "N/A")
        MEM=$(ssh -o ConnectTimeout=5 "$server" "free | awk '/Mem/{printf \"%.0f\", \$3/\$2*100}'" 2>/dev/null || echo "N/A")
        details="Load: $LOAD | Disk: $DISK | Mem: ${MEM}%"

        # Alert thresholds
        if [[ "$DISK" != "N/A" && "${DISK%\%}" -gt 90 ]]; then
            status="WARN"
        fi
    fi

    REPORT+="[$status] $server - $details\n"
}

echo "=== Server Health Report $(date) ==="
for server in "${SERVERS[@]}"; do
    check_server "$server"
done

echo -e "$REPORT"

# Send alert if any issues
if echo -e "$REPORT" | grep -qE "\[DOWN\]|\[WARN\]"; then
    echo -e "Health Check Alert\n\n$REPORT" | mail -s "Server Health Alert" "$ALERT_EMAIL"
fi
```

### Log Analyzer
```bash
#!/bin/bash
set -euo pipefail

LOG_FILE="${1:-/var/log/nginx/access.log}"

echo "=== Log Analysis Report: $(basename "$LOG_FILE") ==="
echo "Generated: $(date)"
echo "---"

echo -e "\n📊 Total Requests: $(wc -l < "$LOG_FILE")"

echo -e "\n📊 Top 10 IP Addresses:"
awk '{print $1}' "$LOG_FILE" | sort | uniq -c | sort -rn | head -10

echo -e "\n📊 HTTP Status Code Distribution:"
awk '{print $9}' "$LOG_FILE" | sort | uniq -c | sort -rn

echo -e "\n📊 Top 10 Requested URLs:"
awk '{print $7}' "$LOG_FILE" | sort | uniq -c | sort -rn | head -10

echo -e "\n📊 Requests Per Hour:"
awk '{print $4}' "$LOG_FILE" | cut -d: -f2 | sort | uniq -c | sort -k2

echo -e "\n📊 5xx Errors:"
awk '$9 ~ /^5/ {print $1, $7, $9}' "$LOG_FILE" | head -20
```

---

## 11. Cheat Sheet

| Syntax | Purpose |
|--------|---------|
| `#!/bin/bash` | Shebang – define interpreter |
| `$1, $2, ..., $@` | Script arguments |
| `$?` | Last command exit status |
| `$$` | Current PID |
| `$(command)` | Command substitution |
| `${VAR:-default}` | Default value if unset |
| `${VAR:=default}` | Set default if unset |
| `${#VAR}` | String length |
| `${VAR/old/new}` | String replacement |
| `[ condition ]` | Test command |
| `[[ condition ]]` | Extended test (supports regex, `&&`, `\|\|`) |
| `if / elif / else / fi` | Conditional |
| `case / esac` | Pattern matching |
| `for x in list; do ... done` | For loop |
| `while [ cond ]; do ... done` | While loop |
| `func() { ... }` | Function definition |
| `local var=value` | Local variable in function |
| `set -euo pipefail` | Strict error mode |
| `trap 'cmd' EXIT` | Run on script exit |
| `2>&1` | Redirect stderr to stdout |
| `\| tee file` | Output to both screen and file |
| `> file` | Overwrite file |
| `>> file` | Append to file |
| `< file` | Read from file |
| `command \|\| die "msg"` | Error handling |

---

## 12. Hands-on Labs

### Lab 1: Automated Backup Script with Rotation
```bash
# Create a backup script that:
# 1. Backs up /etc to /backup with timestamp
# 2. Keeps only last 5 backups
# 3. Logs everything
# 4. Sends email on failure

# Solution: Create /opt/scripts/backup.sh
cat << 'SCRIPT' > /opt/scripts/backup.sh
#!/bin/bash
set -euo pipefail
LOG="/var/log/backup.log"
BACKUP_DIR="/backup/etc"
MAX_BACKUPS=5

log() { echo "[$(date '+%F %T')] $1" | tee -a "$LOG"; }
trap 'log "ERROR: Backup failed on line $LINENO"' ERR

log "Backup started"
mkdir -p "$BACKUP_DIR"
ARCHIVE="${BACKUP_DIR}/etc_$(date +%Y%m%d_%H%M%S).tar.gz"
tar -czf "$ARCHIVE" /etc 2>/dev/null
log "Created: $ARCHIVE ($(du -h "$ARCHIVE" | cut -f1))"

# Keep only MAX_BACKUPS
ls -t "${BACKUP_DIR}"/etc_*.tar.gz | tail -n +$((MAX_BACKUPS+1)) | xargs -r rm
log "Cleanup done. $(ls "${BACKUP_DIR}"/etc_*.tar.gz | wc -l) backups retained."
log "Backup complete"
SCRIPT
chmod +x /opt/scripts/backup.sh
```

### Lab 2: Service Monitor with Alerts
```bash
# Write a script that checks if critical services are running
# and restarts them if they're down

cat << 'SCRIPT' > /opt/scripts/monitor.sh
#!/bin/bash
set -uo pipefail

SERVICES=("nginx" "docker" "sshd")
LOG="/var/log/service-monitor.log"

log() { echo "[$(date '+%F %T')] $1" | tee -a "$LOG"; }

for svc in "${SERVICES[@]}"; do
    if ! systemctl is-active "$svc" > /dev/null 2>&1; then
        log "ALERT: $svc is DOWN. Attempting restart..."
        if systemctl restart "$svc" 2>/dev/null; then
            log "SUCCESS: $svc restarted"
        else
            log "CRITICAL: Failed to restart $svc"
        fi
    else
        log "OK: $svc is running"
    fi
done
SCRIPT
chmod +x /opt/scripts/monitor.sh

# Add to cron (every 5 minutes)
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/scripts/monitor.sh") | crontab -
```

### Lab 3: Deployment Script with Rollback
```bash
# Create a deployment script with rollback capability

cat << 'SCRIPT' > /opt/scripts/deploy.sh
#!/bin/bash
set -euo pipefail

APP_DIR="/opt/myapp"
RELEASES_DIR="$APP_DIR/releases"
CURRENT_LINK="$APP_DIR/current"
MAX_RELEASES=5

usage() { echo "Usage: $0 -v <version> [-r rollback]"; exit 1; }

while getopts "v:rh" opt; do
    case $opt in
        v) VERSION=$OPTARG ;;
        r) ROLLBACK=true ;;
        h) usage ;;
        *) usage ;;
    esac
done

deploy() {
    local version=$1
    local release_dir="$RELEASES_DIR/$version"
    echo "Deploying version $version..."
    mkdir -p "$release_dir"
    # Download / copy application files here
    echo "$version" > "$release_dir/VERSION"
    ln -sfn "$release_dir" "$CURRENT_LINK"
    echo "Deployed: $(readlink "$CURRENT_LINK")"
}

rollback() {
    local previous=$(ls -t "$RELEASES_DIR" | sed -n '2p')
    if [ -z "$previous" ]; then
        echo "No previous release to rollback to"
        exit 1
    fi
    echo "Rolling back to $previous..."
    ln -sfn "$RELEASES_DIR/$previous" "$CURRENT_LINK"
    echo "Rolled back to: $(readlink "$CURRENT_LINK")"
}

if [ "${ROLLBACK:-false}" = true ]; then
    rollback
else
    [ -z "${VERSION:-}" ] && usage
    deploy "$VERSION"
fi
SCRIPT
chmod +x /opt/scripts/deploy.sh
```

---

## 13. Real-world Scenarios

### Scenario 1: Automate User Onboarding

**Situation:** New team members need accounts on 10 servers with specific group memberships and SSH keys.

```bash
#!/bin/bash
set -euo pipefail

# users.csv format: username,fullname,groups,ssh_pubkey
USER_FILE="users.csv"
SERVERS=("web01" "web02" "api01" "db01")

while IFS=, read -r username fullname groups pubkey; do
    [[ "$username" == "username" ]] && continue  # Skip header

    for server in "${SERVERS[@]}"; do
        echo "Creating $username on $server..."
        ssh "$server" bash <<REMOTE
            useradd -m -c '$fullname' -s /bin/bash '$username' 2>/dev/null || true
            for grp in $(echo '$groups' | tr ';' ' '); do
                usermod -aG "\$grp" '$username' 2>/dev/null || true
            done
            mkdir -p /home/$username/.ssh
            echo '$pubkey' >> /home/$username/.ssh/authorized_keys
            chmod 700 /home/$username/.ssh
            chmod 600 /home/$username/.ssh/authorized_keys
            chown -R $username:$username /home/$username/.ssh
REMOTE
        echo "  Done on $server"
    done
done < "$USER_FILE"
```

### Scenario 2: Automated SSL Certificate Renewal Check

**Situation:** Monitor SSL certificates across all domains and alert before expiry.

```bash
#!/bin/bash
set -uo pipefail

DOMAINS=("example.com" "api.example.com" "app.example.com")
WARN_DAYS=30
ALERT_EMAIL="ops@company.com"
REPORT=""

for domain in "${DOMAINS[@]}"; do
    EXPIRY=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null \
        | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)

    if [ -z "$EXPIRY" ]; then
        REPORT+="[ERROR] $domain - Could not check certificate\n"
        continue
    fi

    EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s)
    NOW_EPOCH=$(date +%s)
    DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))

    if [ "$DAYS_LEFT" -lt 0 ]; then
        REPORT+="[EXPIRED] $domain - Expired $((DAYS_LEFT * -1)) days ago!\n"
    elif [ "$DAYS_LEFT" -lt "$WARN_DAYS" ]; then
        REPORT+="[WARNING] $domain - Expires in $DAYS_LEFT days ($EXPIRY)\n"
    else
        REPORT+="[OK] $domain - Expires in $DAYS_LEFT days\n"
    fi
done

echo -e "=== SSL Certificate Report ===\n$REPORT"
```

---

## 14. Interview Q&A (50 Questions)

### Basic (1–15)

**Q1: What is a shell script?**
> A text file containing a sequence of shell commands that are executed as a program. It automates repetitive tasks on Linux/Unix systems.

**Q2: What is the shebang (`#!/bin/bash`)?**
> The first line of a script that tells the OS which interpreter to use. `#!/bin/bash` for Bash, `#!/usr/bin/env python3` for Python.

**Q3: How do you make a script executable?**
> `chmod +x script.sh`, then run with `./script.sh`.

**Q4: What is the difference between `$@` and `$*`?**
> Both represent all arguments. `"$@"` expands to separate quoted words (`"$1" "$2" "$3"`). `"$*"` expands to a single string (`"$1 $2 $3"`). Use `"$@"` in most cases.

**Q5: How do you read user input?**
> `read -p "Enter name: " NAME` stores input in `$NAME`.

**Q6: What are exit codes?**
> Numeric values returned by commands. `0` = success, `1-255` = failure. Check with `$?`. Set in scripts with `exit 1`.

**Q7: What is the difference between single and double quotes?**
> **Double quotes** (`" "`) allow variable expansion and command substitution. **Single quotes** (`' '`) treat everything as literal text. Backticks `` ` ` `` do command substitution (prefer `$()`) .

**Q8: How do you comment in a shell script?**
> Single line: `# comment`. Multi-line: Use `#` on each line, or heredoc `<< 'COMMENT' ... COMMENT` to block-comment.

**Q9: What does `set -e` do?**
> Causes the script to exit immediately if any command returns a non-zero exit status. Part of strict mode (`set -euo pipefail`).

**Q10: How do you check if a file exists?**
> `if [ -f "/path/file" ]; then echo "exists"; fi`. Use `-d` for directories, `-e` for any path.

**Q11: What is command substitution?**
> Capturing the output of a command into a variable: `RESULT=$(command)` or `` RESULT=`command` ``. Prefer `$()` as it supports nesting.

**Q12: How do you loop through files in a directory?**
> `for file in /var/log/*.log; do echo "$file"; done`

**Q13: What is `/dev/null`?**
> A special file that discards all data written to it. Used to suppress output: `command > /dev/null 2>&1`.

**Q14: How do you define a function in Bash?**
> `function_name() { commands; }` or `function function_name { commands; }`. Call with `function_name arg1 arg2`.

**Q15: What does `2>&1` mean?**
> Redirects stderr (file descriptor 2) to stdout (file descriptor 1). Combines both output streams.

### Intermediate (16–35)

**Q16: What is `set -euo pipefail`?**
> **`-e`:** Exit on error. **`-u`:** Error on unset variables. **`-o pipefail`:** Pipeline fails if any command in it fails (not just the last one). Recommended for all scripts.

**Q17: What is a trap in shell scripting?**
> `trap` catches signals and executes cleanup code. `trap 'rm -f /tmp/lock' EXIT` runs cleanup when the script exits (normally or on error).

**Q18: What is the difference between `[` and `[[`?**
> `[` is a command (POSIX). `[[` is a Bash keyword with extra features: pattern matching (`==`), regex (`=~`), no word splitting, supports `&&` and `||` inside.

**Q19: How do you handle command-line arguments with flags?**
> Use `getopts`: `while getopts "f:v" opt; do case $opt in f) FILE=$OPTARG;; v) VERBOSE=true;; esac; done`. The `:` after `f` means it takes an argument.

**Q20: What is parameter expansion with defaults?**
> `${VAR:-default}` uses "default" if VAR is unset/empty. `${VAR:=default}` also sets VAR. `${VAR:?error msg}` exits with error if unset.

**Q21: How do you do arithmetic in Bash?**
> `$(( expression ))`: `SUM=$((5 + 3))`. For floating point: `bc`: `echo "3.14 * 2" | bc`.

**Q22: What is process substitution?**
> `<(command)` treats command output as a file. `diff <(sort file1) <(sort file2)` compares sorted versions without temp files.

**Q23: How do you run commands in parallel in a script?**
> Use background processes: `cmd1 & cmd2 & wait`. Or use `xargs -P`: `echo -e "a\nb\nc" | xargs -P 3 -I {} process {}`.

**Q24: What is a here document (heredoc)?**
> Multi-line input to a command:
```bash
cat << EOF
Hello $USER
Today is $(date)
EOF
```
> Use `<< 'EOF'` to prevent variable expansion.

**Q25: How do you debug a shell script?**
> `bash -x script.sh` (trace mode), `set -x` in script, `set +x` to stop. `PS4='+(${BASH_SOURCE}:${LINENO}): '` for detailed tracing.

**Q26: What is an array in Bash?**
> An ordered collection. Declare: `ARR=("a" "b" "c")`. Access: `${ARR[0]}`. All: `${ARR[@]}`. Length: `${#ARR[@]}`.

**Q27: What is the difference between `source` and `./`?**
> `source script.sh` (or `. script.sh`) runs in the current shell—variables and functions persist. `./script.sh` runs in a subshell—changes don't affect the parent.

**Q28: How do you lock a script to prevent concurrent execution?**
> Use a lock file with `flock`:
```bash
exec 200>/var/lock/myscript.lock
flock -n 200 || { echo "Already running"; exit 1; }
```

**Q29: What is `xargs` and when do you use it?**
> Converts stdin into arguments for a command. `find /tmp -name "*.log" | xargs rm`. Use `-I {}` for placement: `cat urls.txt | xargs -I {} curl {}`.

**Q30: How do you send email from a script?**
> `echo "Body" | mail -s "Subject" user@example.com` or use `sendmail` or `curl` with an SMTP API.

**Q31: What is signal handling?**
> Scripts can catch signals: `trap 'echo "Caught SIGINT"; exit' INT`. Common signals: `INT` (Ctrl+C), `TERM` (kill), `HUP` (hangup), `EXIT` (script end).

**Q32: How do you create a menu in a script?**
> Use `select`:
```bash
select opt in "Deploy" "Rollback" "Status" "Quit"; do
    case $opt in
        Deploy) deploy;;
        Rollback) rollback;;
        Status) status;;
        Quit) break;;
    esac
done
```

**Q33: What is `eval` and why is it risky?**
> `eval` executes a string as a command. It's risky because it can execute arbitrary code if the string contains user input—use with extreme caution to avoid code injection.

**Q34: How do you handle JSON in shell scripts?**
> Use `jq`: `curl -s api.example.com/data | jq '.items[].name'`. Parse: `jq -r '.version'`. Create: `jq -n --arg v "1.0" '{version: $v}'`.

**Q35: What is a coprocess in Bash?**
> `coproc` runs a command in the background with pipes for bidirectional communication. `coproc myproc { while read line; do echo "Got: $line"; done; }`.

### Advanced (36–50)

**Q36: How do you write portable shell scripts?**
> 1) Use `#!/bin/sh` instead of `#!/bin/bash` 2) Avoid Bash-specific features (`[[`, arrays, `+=`) 3) Use POSIX commands 4) Test with `dash` or `ash` 5) Use `shellcheck` for linting.

**Q37: What is `shellcheck`?**
> A static analysis tool for shell scripts. Finds bugs, pitfalls, and portability issues. Use: `shellcheck script.sh`. Integrates with CI/CD pipelines.

**Q38: How do you implement a retry mechanism?**
> Loop with exponential backoff:
```bash
for i in 1 2 4 8 16; do
    command && break
    echo "Retry in ${i}s..."
    sleep $i
done
```

**Q39: How do you safely handle temporary files?**
> Use `mktemp`: `TMPFILE=$(mktemp)` or `TMPDIR=$(mktemp -d)`. Clean up with `trap 'rm -rf "$TMPDIR"' EXIT`. Never use predictable names in `/tmp`.

**Q40: What is the difference between `exec` and running a command?**
> `exec` **replaces** the current shell process with the command (no new process). Also used for file descriptor redirection: `exec 3>output.log`.

**Q41: How do you write scripts that handle filenames with spaces?**
> Always quote variables: `"$file"`. Use `find -print0 | xargs -0`. Set IFS: `IFS=$'\n'`. Use `while read -r` instead of `for file in $(command)`.

**Q42: How do you implement a daemon in shell?**
> Fork to background, detach from terminal, redirect I/O:
```bash
(
    exec > /var/log/daemon.log 2>&1
    while true; do
        do_work
        sleep 60
    done
) &
disown
echo $! > /var/run/daemon.pid
```

**Q43: What is the difference between `grep`, `sed`, and `awk`?**
> **grep:** Search/filter lines matching a pattern. **sed:** Stream editor—find and replace, delete lines. **awk:** Full programming language for column-based data processing. Use grep for searching, sed for simple transformations, awk for complex parsing.

**Q44: How do you securely handle passwords in scripts?**
> 1) Never hardcode credentials 2) Use environment variables 3) Read from secured files with restricted permissions 4) Use vault tools (HashiCorp Vault, AWS Secrets Manager) 5) Use `read -s` for interactive input.

**Q45: How would you parse a CSV file in Bash?**
```bash
while IFS=, read -r col1 col2 col3; do
    echo "Name: $col1, Age: $col2, Role: $col3"
done < data.csv
```

**Q46: What is the difference between `&&`, `||`, and `;`?**
> `&&`: Run next only if previous succeeds. `||`: Run next only if previous fails. `;`: Run next regardless. Example: `make && make install || echo "Build failed"`.

**Q47: How do you profile a shell script's performance?**
> Use `time ./script.sh`, or `PS4='+ $(date "+%s.%N") '` with `set -x` to timestamp each line. Use `strace -c ./script.sh` for system call profiling.

**Q48: What is the `PIPESTATUS` array?**
> Stores the exit status of each command in the last pipeline. `cmd1 | cmd2 | cmd3; echo ${PIPESTATUS[0]} ${PIPESTATUS[1]} ${PIPESTATUS[2]}`. Useful with `pipefail`.

**Q49: How do you manage configuration files in scripts?**
> Source a config file: `source /etc/myapp/config.sh`. Or parse key=value: `while IFS='=' read -r key value; do export "$key=$value"; done < config.env`.

**Q50: Write a one-liner to find the top 5 processes consuming the most memory.**
> `ps aux --sort=-%mem | awk 'NR<=6{printf "%-10s %-8s %-6s %s\n", $1, $2, $4, $11}'`

---

*Last updated: April 2026*
