# 🐧 Linux – DevOps Notes

---

## 1. Introduction to Linux

Linux is an open-source operating system based on the Unix architecture. It is the backbone of most servers, cloud infrastructure, and DevOps tooling.

### Why Linux for DevOps?
- Powers 90%+ of cloud servers (AWS, Azure, GCP)
- Native support for containers (Docker, K8s)
- Robust CLI for automation and scripting
- Free, stable, and highly secure

---

## 2. Linux File System Hierarchy

```
/
├── bin/      # Essential user binaries (ls, cp, mv)
├── boot/     # Boot loader files (vmlinuz, grub)
├── dev/      # Device files (sda, tty)
├── etc/      # System-wide configuration files
├── home/     # User home directories
├── lib/      # Shared libraries for /bin and /sbin
├── opt/      # Optional/third-party software
├── proc/     # Virtual filesystem – process & kernel info
├── root/     # Root user's home directory
├── run/      # Runtime variable data since last boot
├── sbin/     # System binaries (fdisk, iptables)
├── tmp/      # Temporary files (cleared on reboot)
├── usr/      # User programs, libraries, docs
│   ├── bin/
│   ├── lib/
│   └── share/
├── var/      # Variable data – logs, spool, mail
│   ├── log/
│   ├── tmp/
│   └── spool/
└── mnt/      # Temporary mount points
```

---

## 3. Essential Linux Commands

### File & Directory Operations
```bash
# List files with details
ls -la
ls -lhS          # Sort by size

# Create nested directories
mkdir -p /opt/myapp/config/env

# Copy files/directories
cp file.txt /tmp/
cp -r source_dir/ dest_dir/

# Move / Rename
mv oldname.txt newname.txt
mv file.txt /opt/myapp/

# Remove files/directories
rm file.txt
rm -rf /tmp/old-data/    # Recursive + force (use with caution)

# Find files
find / -name "*.log" -mtime +7            # Logs older than 7 days
find /home -type f -size +100M            # Files > 100MB
find / -user root -perm -4000 2>/dev/null # SUID files

# Disk usage
du -sh /var/log/*
df -h
```

### File Viewing & Editing
```bash
cat file.txt            # Print entire file
head -n 20 file.txt     # First 20 lines
tail -f /var/log/syslog # Follow log in real-time
less file.txt           # Paginated view
wc -l file.txt          # Count lines
```

### File Permissions
```bash
# Permission breakdown:  rwx = read(4) + write(2) + execute(1)
# Format: [type][owner][group][others]
# Example: -rwxr-xr-- = 754

chmod 755 script.sh       # Owner: rwx, Group: r-x, Others: r-x
chmod u+x script.sh       # Add execute for owner only
chmod -R 644 /var/www/     # Recursive

chown user:group file.txt  # Change owner and group
chown -R deploy:deploy /opt/app/

# Special permissions
chmod u+s binary           # SUID – run as file owner
chmod g+s directory        # SGID – inherit group
chmod +t /tmp              # Sticky bit – only owner can delete
```

### Process Management
```bash
ps aux                     # All running processes
ps aux | grep nginx        # Filter by name
top                        # Real-time process viewer
htop                       # Interactive process viewer

kill <PID>                 # Graceful termination (SIGTERM)
kill -9 <PID>              # Force kill (SIGKILL)
killall nginx              # Kill by name
pkill -f "python app.py"  # Kill by pattern

# Background processes
nohup ./long-task.sh &     # Run in background, survive logout
jobs                       # List background jobs
fg %1                      # Bring job 1 to foreground

# Check open ports / connections
netstat -tulnp
ss -tulnp
lsof -i :8080
```

### User & Group Management
```bash
# User operations
useradd -m -s /bin/bash devuser   # Create user with home dir
passwd devuser                    # Set password
userdel -r devuser                # Delete user + home dir
usermod -aG docker devuser        # Add user to group

# Group operations
groupadd devops
groupdel devops

# Info commands
whoami
id devuser
groups devuser
cat /etc/passwd
cat /etc/shadow                   # Password hashes (root only)

# Switch user
su - devuser
sudo -u devuser command
```

### Package Management
```bash
# Debian / Ubuntu (APT)
apt update && apt upgrade -y
apt install nginx -y
apt remove nginx
apt autoremove
dpkg -l | grep nginx

# RHEL / CentOS / Amazon Linux (YUM/DNF)
yum update -y
yum install httpd -y
yum remove httpd
dnf install docker-ce -y
rpm -qa | grep httpd
```

---

## 4. Text Processing

```bash
# grep – search patterns
grep "error" /var/log/syslog
grep -rn "TODO" /opt/app/         # Recursive + line numbers
grep -i "warning" app.log | wc -l # Case-insensitive count
grep -v "^#" config.conf          # Exclude comment lines
grep -E "error|fail|critical" app.log  # Multiple patterns

# awk – column processing
awk '{print $1, $4}' access.log
awk -F: '{print $1, $3}' /etc/passwd    # Custom delimiter
awk '$3 > 1000 {print $1}' /etc/passwd  # Conditional
awk '{sum+=$1} END {print sum}' data.txt # Sum column

# sed – stream editing
sed 's/old/new/g' file.txt              # Replace all occurrences
sed -i 's/DEBUG/INFO/g' config.yml      # In-place edit
sed -n '10,20p' file.txt                # Print lines 10-20
sed '/^$/d' file.txt                    # Remove blank lines

# cut, sort, uniq
cut -d: -f1,3 /etc/passwd | sort -t: -k2 -n
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10
```

---

## 5. Systemd & Service Management

```bash
# Service lifecycle
systemctl start nginx
systemctl stop nginx
systemctl restart nginx
systemctl reload nginx       # Reload config without restart

# Enable/disable at boot
systemctl enable nginx
systemctl disable nginx

# Check status
systemctl status nginx
systemctl is-active nginx
systemctl is-enabled nginx

# List all services
systemctl list-units --type=service --state=running

# View logs
journalctl -u nginx -f                    # Follow logs
journalctl -u nginx --since "1 hour ago"
journalctl -u nginx --since "2026-04-01" --until "2026-04-05"
journalctl -p err                          # Only error priority
```

### Creating a Custom Service
```ini
# /etc/systemd/system/myapp.service
[Unit]
Description=My Application Service
After=network.target
Requires=network.target

[Service]
Type=simple
User=appuser
Group=appuser
WorkingDirectory=/opt/myapp
ExecStart=/opt/myapp/start.sh
ExecStop=/opt/myapp/stop.sh
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```
```bash
systemctl daemon-reload
systemctl enable --now myapp
```

---

## 6. Cron Jobs & Scheduling

```bash
# Edit crontab
crontab -e

# Cron format:
# MIN  HOUR  DOM  MON  DOW  COMMAND
# (0-59)(0-23)(1-31)(1-12)(0-7)

# Examples
0 2 * * *   /opt/scripts/backup.sh           # Daily at 2:00 AM
*/5 * * * * /opt/scripts/health-check.sh      # Every 5 minutes
0 0 * * 0   /opt/scripts/weekly-cleanup.sh    # Every Sunday midnight
30 6 1 * *  /opt/scripts/monthly-report.sh    # 1st of month at 6:30 AM

# List / remove
crontab -l
crontab -r

# System-wide cron
ls /etc/cron.d/
ls /etc/cron.daily/
ls /etc/cron.weekly/
```

---

## 7. SSH & Remote Access

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "devops@company.com"
ssh-keygen -t rsa -b 4096   # RSA alternative

# Copy public key to server
ssh-copy-id user@192.168.1.100

# Connect to server
ssh user@192.168.1.100
ssh -i ~/.ssh/prod_key user@10.0.1.50
ssh -p 2222 user@server       # Custom port

# SCP – secure copy
scp file.txt user@server:/tmp/
scp -r local_dir/ user@server:/opt/
scp user@server:/var/log/app.log ./

# SSH config file (~/.ssh/config)
Host prod-web
    HostName 10.0.1.50
    User deploy
    IdentityFile ~/.ssh/prod_key
    Port 22
    ForwardAgent yes

Host staging-*
    User deploy
    IdentityFile ~/.ssh/staging_key

# SSH tunneling
ssh -L 8080:db-server:3306 user@jumphost   # Local forwarding
ssh -R 9090:localhost:8080 user@remote      # Remote forwarding
ssh -D 1080 user@proxy-server              # Dynamic SOCKS proxy
```

### SSH Hardening (/etc/ssh/sshd_config)
```bash
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
AllowUsers deploy admin
```

---

## 8. Disk & Storage Management

```bash
# List block devices
lsblk
fdisk -l

# Partition a disk
fdisk /dev/sdb      # Interactive
# n → new partition, p → primary, w → write

# Create filesystem
mkfs.ext4 /dev/sdb1
mkfs.xfs /dev/sdb1

# Mount
mount /dev/sdb1 /mnt/data
umount /mnt/data

# Persistent mount (/etc/fstab)
/dev/sdb1  /mnt/data  ext4  defaults  0  2
UUID=xxxx  /mnt/data  xfs   defaults  0  2

# Check filesystem
fsck /dev/sdb1

# LVM – Logical Volume Manager
pvcreate /dev/sdb /dev/sdc       # Physical volumes
vgcreate datavg /dev/sdb /dev/sdc # Volume group
lvcreate -L 20G -n datalv datavg # Logical volume
mkfs.ext4 /dev/datavg/datalv
mount /dev/datavg/datalv /mnt/data

# Extend LVM
lvextend -L +10G /dev/datavg/datalv
resize2fs /dev/datavg/datalv      # ext4
xfs_growfs /mnt/data              # xfs
```

---

## 9. Networking Commands

```bash
# IP configuration
ip addr show
ip route show
ip link set eth0 up/down

# Connectivity tests
ping -c 4 google.com
traceroute google.com
mtr google.com                    # Combined ping + traceroute

# DNS
nslookup example.com
dig example.com +short
dig example.com MX
host example.com
cat /etc/resolv.conf

# HTTP testing
curl -I https://example.com           # Headers only
curl -X POST -H "Content-Type: application/json" \
     -d '{"key":"value"}' http://api.example.com
wget https://example.com/file.tar.gz

# Firewall
# firewalld
firewall-cmd --add-port=8080/tcp --permanent
firewall-cmd --add-service=http --permanent
firewall-cmd --reload
firewall-cmd --list-all

# iptables
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -j DROP
iptables -L -n

# UFW (Ubuntu)
ufw allow 22/tcp
ufw allow 80/tcp
ufw enable
ufw status
```

---

## 10. Cheat Sheet – Top 30 Commands

| Command | Purpose |
|---------|---------|
| `ls -la` | List all files with details |
| `cd /path` | Change directory |
| `pwd` | Print working directory |
| `mkdir -p` | Create nested directories |
| `cp -r` | Copy recursively |
| `mv` | Move or rename |
| `rm -rf` | Remove recursively (caution!) |
| `find` | Search files by criteria |
| `grep -rn` | Search text in files |
| `awk` | Column-based text processing |
| `sed -i` | In-place text substitution |
| `chmod` | Change file permissions |
| `chown` | Change file ownership |
| `ps aux` | List all processes |
| `kill -9` | Force kill a process |
| `top` / `htop` | Monitor processes in real-time |
| `df -h` | Disk space usage |
| `du -sh` | Directory size |
| `free -h` | Memory usage |
| `systemctl` | Manage systemd services |
| `journalctl` | View systemd logs |
| `crontab -e` | Edit scheduled jobs |
| `ssh` | Remote login |
| `scp` | Secure file copy |
| `curl` | HTTP requests |
| `tar -czvf` | Create compressed archive |
| `tail -f` | Follow log file |
| `netstat -tulnp` | List open ports |
| `ip addr` | Show IP configuration |
| `useradd` | Create user |

---

## 11. Hands-on Labs

### Lab 1: User Setup and Permissions
```bash
# Step 1: Create a group and user
sudo groupadd devops
sudo useradd -m -s /bin/bash -G devops devuser

# Step 2: Create a shared project directory
sudo mkdir -p /opt/project
sudo chown root:devops /opt/project
sudo chmod 2775 /opt/project   # SGID so new files inherit group

# Step 3: Test as devuser
sudo su - devuser
touch /opt/project/test.txt
ls -la /opt/project/   # Should show group = devops

# Step 4: Restrict others
sudo chmod 770 /opt/project
```

### Lab 2: Create a Custom Systemd Service
```bash
# Step 1: Create a simple application script
sudo mkdir -p /opt/healthcheck
cat <<'EOF' | sudo tee /opt/healthcheck/run.sh
#!/bin/bash
while true; do
    echo "$(date) - Health OK" >> /var/log/healthcheck.log
    sleep 30
done
EOF
sudo chmod +x /opt/healthcheck/run.sh

# Step 2: Create the systemd unit file
cat <<'EOF' | sudo tee /etc/systemd/system/healthcheck.service
[Unit]
Description=Health Check Service
After=network.target

[Service]
ExecStart=/opt/healthcheck/run.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Step 3: Enable and start
sudo systemctl daemon-reload
sudo systemctl enable --now healthcheck

# Step 4: Verify
systemctl status healthcheck
tail -f /var/log/healthcheck.log
```

### Lab 3: Cron Job for Log Rotation
```bash
# Step 1: Create cleanup script
cat <<'EOF' | sudo tee /opt/scripts/cleanup-logs.sh
#!/bin/bash
LOG_DIR="/var/log/myapp"
DAYS=7
find "$LOG_DIR" -name "*.log" -mtime +$DAYS -delete
echo "$(date) - Cleaned logs older than $DAYS days" >> /var/log/cleanup.log
EOF
sudo chmod +x /opt/scripts/cleanup-logs.sh

# Step 2: Add cron job (runs daily at 3 AM)
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/scripts/cleanup-logs.sh") | crontab -

# Step 3: Verify
crontab -l
```

### Lab 4: SSH Key-based Authentication
```bash
# Step 1: Generate key pair (on local machine)
ssh-keygen -t ed25519 -f ~/.ssh/lab_key -N ""

# Step 2: Copy public key to target server
ssh-copy-id -i ~/.ssh/lab_key.pub user@target-server

# Step 3: Test passwordless login
ssh -i ~/.ssh/lab_key user@target-server

# Step 4: Add to SSH config
cat <<EOF >> ~/.ssh/config
Host lab-server
    HostName target-server
    User user
    IdentityFile ~/.ssh/lab_key
EOF

# Step 5: Connect using alias
ssh lab-server
```

### Lab 5: LVM Disk Setup
```bash
# Step 1: Create physical volume
sudo pvcreate /dev/sdb

# Step 2: Create volume group
sudo vgcreate appvg /dev/sdb

# Step 3: Create logical volume (10GB)
sudo lvcreate -L 10G -n applv appvg

# Step 4: Format and mount
sudo mkfs.ext4 /dev/appvg/applv
sudo mkdir /mnt/appdata
sudo mount /dev/appvg/applv /mnt/appdata

# Step 5: Make persistent
echo "/dev/appvg/applv /mnt/appdata ext4 defaults 0 2" | sudo tee -a /etc/fstab

# Step 6: Verify
df -h /mnt/appdata
lsblk
```

---

## 12. Real-world Scenarios

### Scenario 1: Troubleshooting High CPU on a Production Server

**Situation:** Monitoring alerts show CPU at 95% on a web server.

**Solution:**
```bash
# Step 1: Identify the process
top -b -n 1 | head -20
# or
ps aux --sort=-%cpu | head -10

# Step 2: Get details about the process
strace -p <PID> -c           # System call summary
lsof -p <PID>                # Open files by process

# Step 3: Check if it's an application issue
journalctl -u myapp --since "30 min ago"
tail -100 /var/log/myapp/error.log

# Step 4: Temporary mitigation
renice +10 <PID>             # Lower priority
# or if the process is stuck:
kill -15 <PID>               # Graceful stop
systemctl restart myapp      # Restart the service

# Step 5: Investigate root cause
vmstat 1 5                   # Check system stats
iostat -x 1 5                # Check I/O
dmesg | tail -50             # Kernel messages
```

### Scenario 2: Disk Space Full – Application Down

**Situation:** Application stopped logging and returning 500 errors. `df -h` shows `/var` at 100%.

**Solution:**
```bash
# Step 1: Find large files
du -h /var | sort -rh | head -20
find /var -type f -size +100M -exec ls -lh {} \;

# Step 2: Identify and clean safely
# Truncate a large log file (safer than delete if process has it open)
> /var/log/myapp/debug.log

# Step 3: Remove old logs
find /var/log -name "*.gz" -mtime +30 -delete

# Step 4: Check for deleted-but-open files
lsof +L1 | grep deleted

# Step 5: Set up log rotation to prevent recurrence
cat <<EOF | sudo tee /etc/logrotate.d/myapp
/var/log/myapp/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    postrotate
        systemctl reload myapp
    endscript
}
EOF
```

### Scenario 3: Server Not Reachable via SSH

**Situation:** Cannot SSH into a production server.

**Solution:**
```bash
# From your machine – diagnose network
ping <server-ip>                        # Is it reachable?
traceroute <server-ip>                  # Where does it fail?
telnet <server-ip> 22                   # Is SSH port open?
nmap -p 22 <server-ip>                  # Port scan

# If the server is reachable but SSH fails:
# Check via console/out-of-band access:
systemctl status sshd                   # Is SSH running?
journalctl -u sshd -n 50               # SSH logs
cat /etc/ssh/sshd_config | grep -i deny # Deny rules?
iptables -L -n | grep 22               # Firewall blocking?
cat /etc/hosts.deny                     # TCP wrappers?
df -h                                   # Disk full?
cat /var/log/auth.log | tail -50        # Auth failures?
```

---

## 13. Interview Q&A (50 Questions)

### Basic (1–15)

**Q1: What is the difference between Linux and Unix?**
> Linux is open-source and free; Unix is proprietary. Linux was built from scratch inspired by Unix. Linux runs on diverse hardware; Unix typically on specific platforms.

**Q2: What is the Linux kernel?**
> The kernel is the core component that manages hardware resources, memory, processes, and system calls. It acts as a bridge between applications and hardware.

**Q3: What is the difference between `rm` and `rm -rf`?**
> `rm` removes individual files. `rm -rf` removes directories recursively (`-r`) and forcefully (`-f`) without prompting for confirmation.

**Q4: How do you check disk space?**
> `df -h` shows filesystem disk usage. `du -sh /path` shows the size of a specific directory.

**Q5: What is an inode?**
> An inode is a data structure that stores metadata about a file—permissions, owner, size, timestamps, data block pointers—but not the filename or content.

**Q6: What is the difference between hard link and soft link?**
> **Hard link:** Points to the same inode; deleting the original doesn't affect it; can't cross filesystems. **Soft link (symlink):** Points to the filename; breaks if the original is deleted; can cross filesystems.

**Q7: How do you find files larger than 100MB?**
> `find / -type f -size +100M`

**Q8: What is the `/proc` filesystem?**
> A virtual filesystem that provides process and kernel information as files. Examples: `/proc/cpuinfo`, `/proc/meminfo`, `/proc/<PID>/status`.

**Q9: What does `chmod 777` mean?**
> Full read, write, and execute permissions for owner, group, and others. This is a security risk and should be avoided in production.

**Q10: How do you check which process is using a specific port?**
> `lsof -i :8080` or `ss -tulnp | grep 8080` or `netstat -tulnp | grep 8080`

**Q11: What is a zombie process?**
> A process that has finished execution but still has an entry in the process table because its parent hasn't read its exit status via `wait()`.

**Q12: What is the difference between `ps` and `top`?**
> `ps` gives a one-time snapshot of processes. `top` provides a real-time, continuously updating view of system processes and resource usage.

**Q13: What is swap space?**
> Disk space used as virtual memory when physical RAM is full. Configured via a swap partition or swap file. Check with `free -h` or `swapon --show`.

**Q14: How do you make a script executable?**
> `chmod +x script.sh` then run with `./script.sh`. The script should have a shebang line like `#!/bin/bash`.

**Q15: What is the difference between `>` and `>>`?**
> `>` redirects output and **overwrites** the file. `>>` redirects output and **appends** to the file.

### Intermediate (16–35)

**Q16: Explain the Linux boot process.**
> BIOS/UEFI → Bootloader (GRUB2) → Kernel loading → initramfs → init/systemd (PID 1) → Default target (runlevel) → User login

**Q17: What is systemd and how is it different from init?**
> systemd is the modern init system. It starts services in parallel (faster boot), uses unit files instead of shell scripts, manages dependencies, and provides `journalctl` for centralized logging.

**Q18: How do you troubleshoot a service that won't start?**
> 1) `systemctl status service` 2) `journalctl -u service -xe` 3) Check config syntax 4) Verify port availability 5) Check file permissions 6) Check dependencies

**Q19: What is the sticky bit?**
> When set on a directory, only the file owner (or root) can delete files within it. Example: `/tmp`. Set with `chmod +t /dir` (shows as `t` in permissions: `drwxrwxrwt`).

**Q20: What is the difference between SIGTERM and SIGKILL?**
> `SIGTERM (15)`: Graceful termination—process can catch it and clean up. `SIGKILL (9)`: Immediate forced kill—cannot be caught or ignored.

**Q21: How do you check memory usage?**
> `free -h` (summary), `cat /proc/meminfo` (detailed), `vmstat` (virtual memory stats), `top`/`htop` (per-process).

**Q22: What is `/etc/fstab`?**
> A configuration file that defines how disk partitions and filesystems should be automatically mounted at boot. Each line specifies device, mount point, filesystem type, and options.

**Q23: How do you add a new disk in Linux?**
> 1) `fdisk /dev/sdb` to partition 2) `mkfs.ext4 /dev/sdb1` to format 3) `mkdir /mnt/data` 4) `mount /dev/sdb1 /mnt/data` 5) Add entry to `/etc/fstab` for persistence

**Q24: What is the difference between `su` and `sudo`?**
> `su` switches to another user (requires *that user's* password). `sudo` runs a single command as root (requires *your own* password and sudoers entry).

**Q25: What is `/etc/hosts` and when is it used?**
> A file that maps hostnames to IP addresses locally. It is checked before DNS resolution and is useful for overriding DNS, testing, and internal service routing.

**Q26: What are Linux runlevels?**
> Modes of operation: 0=halt, 1=single-user (rescue), 2=multi-user (no networking on some distros), 3=multi-user with networking, 5=multi-user with GUI, 6=reboot. In systemd, these map to targets.

**Q27: How do you archive and compress files?**
> Create: `tar -czvf archive.tar.gz /path/` (gzip) or `tar -cjvf archive.tar.bz2 /path/` (bzip2). Extract: `tar -xzvf archive.tar.gz`

**Q28: What is PAM?**
> Pluggable Authentication Modules—a framework that provides flexible, configurable authentication for Linux services. Config files are in `/etc/pam.d/`.

**Q29: How do you redirect both stdout and stderr to a file?**
> `command > output.log 2>&1` or the shorthand `command &> output.log`

**Q30: What is SELinux?**
> Security-Enhanced Linux—a mandatory access control (MAC) system. Modes: **Enforcing** (blocks violations), **Permissive** (logs only), **Disabled**. Check with `getenforce`, set with `setenforce`.

**Q31: How do you check system uptime and load average?**
> `uptime` shows uptime and load averages (1, 5, 15 min). Load average represents the number of processes waiting for CPU. Ideal: ≤ number of CPU cores.

**Q32: What is a FIFO (named pipe)?**
> A special file for inter-process communication. Created with `mkfifo /tmp/mypipe`. Data written by one process can be read by another.

**Q33: How do you schedule a one-time task?**
> Use the `at` command: `echo "/opt/script.sh" | at 10:00 PM` or `at now + 30 minutes`.

**Q34: What is the difference between `ext4` and `xfs`?**
> `ext4`: Supports shrinking, good for small files, widely used. `xfs`: Better performance for large files, no shrinking, default in RHEL 7+.

**Q35: What is `umask`?**
> A mask that sets default permissions for newly created files and directories. Default umask `022` means files get `644` and directories get `755`. Set with `umask 027`.

### Advanced (36–50)

**Q36: How do you troubleshoot high CPU usage on a production server?**
> 1) `top`/`htop` to identify PID 2) `strace -p PID` to trace syscalls 3) Check app logs 4) `perf top` for kernel profiling 5) `vmstat`/`mpstat` for system stats 6) `renice` to temporarily lower priority

**Q37: Explain the OOM Killer.**
> When the system runs critically low on memory, the kernel's Out-of-Memory Killer selects and terminates processes to free RAM. Check with `dmesg | grep -i oom`. Tune with `oom_score_adj` per process.

**Q38: What are cgroups?**
> Control Groups—a kernel feature to limit, prioritize, and monitor resource usage (CPU, memory, I/O, network) of process groups. Fundamental to container technology (Docker, K8s).

**Q39: What are Linux namespaces?**
> Kernel features that provide isolation: **PID** (process IDs), **NET** (networking), **MNT** (mounts), **UTS** (hostname), **IPC** (inter-process comm), **USER** (user/group IDs). Foundation of containers.

**Q40: How do you create a custom systemd service?**
> Create a unit file at `/etc/systemd/system/myapp.service` with `[Unit]`, `[Service]`, and `[Install]` sections. Then: `systemctl daemon-reload && systemctl enable --now myapp`

**Q41: How do you recover a deleted file that is still open by a process?**
> Find it with `lsof | grep deleted`, then copy from `/proc/<PID>/fd/<FD>` to recover: `cp /proc/1234/fd/5 /tmp/recovered_file`

**Q42: What is `nftables`?**
> The successor to `iptables`. Provides a unified framework for packet filtering, NAT, and packet mangling with better performance and simpler syntax.

**Q43: How do you configure network bonding?**
> Use `nmcli` to create a bond: `nmcli con add type bond ifname bond0 mode active-backup`, then add slave interfaces: `nmcli con add type ethernet ifname eth0 master bond0`

**Q44: What is `kdump`?**
> A kernel crash dump mechanism. When the kernel panics, a secondary kernel boots and captures a memory dump for post-mortem analysis using the `crash` utility.

**Q45: How do you harden a Linux server?**
> 1) Disable root SSH 2) Use key-based auth only 3) Configure firewall (allow only needed ports) 4) Enable SELinux/AppArmor 5) Regular patching 6) Disable unused services 7) Set up fail2ban 8) Enable audit logging 9) Configure log rotation 10) Use strong passwords + MFA

**Q46: What is `auditd`?**
> The Linux audit daemon that tracks security-relevant events—file access, system calls, user actions. Configure rules in `/etc/audit/rules.d/`. View with `ausearch` and `aureport`.

**Q47: How do you tune kernel parameters?**
> Using `sysctl`: `sysctl -w net.core.somaxconn=65535`. Make persistent in `/etc/sysctl.d/99-custom.conf`. Common tuning: TCP buffers, file descriptors, swappiness.

**Q48: What is `strace` and when do you use it?**
> A diagnostic tool that traces system calls and signals of a process. Use it to debug: `strace -p <PID> -f -e trace=network` (trace network calls of a running process).

**Q49: Explain the difference between `initramfs` and `initrd`.**
> Both are initial root filesystems loaded during boot. `initramfs` is a cpio archive extracted to tmpfs (modern). `initrd` is a block device image mounted as a filesystem (legacy).

**Q50: How do you perform a live kernel upgrade (kexec)?**
> `kexec` loads a new kernel without full reboot: `kexec -l /boot/vmlinuz-new --initrd=/boot/initramfs-new.img --reuse-cmdline` then `kexec -e`. Useful for minimizing downtime.

---

*Last updated: April 2026*
