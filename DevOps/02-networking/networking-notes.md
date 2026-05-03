---
title: Networking Notes
layout: default
render_with_liquid: false
---
# 🌐 Networking – DevOps Notes

---

## 1. Introduction

Networking is fundamental to DevOps—every service, deployment, and monitoring system relies on network communication. Understanding protocols, routing, DNS, and security is essential for troubleshooting issues and designing resilient architectures.

---

## 2. OSI Model (7 Layers)

```
Layer 7 – Application    → HTTP, HTTPS, FTP, SSH, DNS, SMTP, SNMP
Layer 6 – Presentation   → SSL/TLS, encryption, data compression, encoding
Layer 5 – Session         → Session establishment, authentication, RPC
Layer 4 – Transport       → TCP (reliable), UDP (fast) – port-based
Layer 3 – Network         → IP addressing, routing, ICMP, ARP
Layer 2 – Data Link       → MAC addresses, switches, Ethernet frames, VLANs
Layer 1 – Physical        → Cables, hubs, fiber optics, wireless signals
```

### How data flows:
```
Sender:   Application → Transport → Network → Data Link → Physical
                        (encapsulation – headers added at each layer)
Receiver: Physical → Data Link → Network → Transport → Application
                        (decapsulation – headers removed at each layer)
```

---

## 3. TCP/IP Model (4 Layers)

```
Application    → HTTP, DNS, FTP, SSH, SMTP
Transport      → TCP, UDP
Internet       → IP, ICMP, ARP, IGMP
Network Access → Ethernet, Wi-Fi, PPP
```

| OSI Layer | TCP/IP Layer |
|-----------|-------------|
| 7, 6, 5  | Application |
| 4         | Transport   |
| 3         | Internet    |
| 2, 1      | Network Access |

---

## 4. IP Addressing & Subnetting

### IPv4
```
Format: 192.168.1.100 (32-bit, 4 octets)

Classes:
  A: 1.0.0.0   – 126.255.255.255   /8    (16M hosts)
  B: 128.0.0.0 – 191.255.255.255   /16   (65K hosts)
  C: 192.0.0.0 – 223.255.255.255   /24   (254 hosts)

Private IP Ranges (RFC 1918):
  10.0.0.0/8         → 10.0.0.0 – 10.255.255.255
  172.16.0.0/12      → 172.16.0.0 – 172.31.255.255
  192.168.0.0/16     → 192.168.0.0 – 192.168.255.255

Special:
  127.0.0.1          → Loopback (localhost)
  169.254.0.0/16     → Link-local (APIPA)
  0.0.0.0            → Default route / all interfaces
```

### CIDR Notation & Subnetting
```
CIDR    Subnet Mask         Usable Hosts    Wildcard
/8      255.0.0.0           16,777,214      0.255.255.255
/16     255.255.0.0         65,534          0.0.255.255
/24     255.255.255.0       254             0.0.0.255
/25     255.255.255.128     126             0.0.0.127
/26     255.255.255.192     62              0.0.0.63
/27     255.255.255.224     30              0.0.0.31
/28     255.255.255.240     14              0.0.0.15
/30     255.255.255.252     2               0.0.0.3
/32     255.255.255.255     1               0.0.0.0
```

### Subnetting Example
```
Given: 192.168.10.0/24 — split into 4 subnets

New mask: /26 (255.255.255.192) → 62 hosts per subnet

Subnet 1: 192.168.10.0/26    → Hosts: .1  – .62   | Broadcast: .63
Subnet 2: 192.168.10.64/26   → Hosts: .65 – .126  | Broadcast: .127
Subnet 3: 192.168.10.128/26  → Hosts: .129 – .190 | Broadcast: .191
Subnet 4: 192.168.10.192/26  → Hosts: .193 – .254 | Broadcast: .255
```

---

## 5. DNS (Domain Name System)

### Resolution Flow
```
User types example.com
  → Browser cache
  → OS cache (/etc/hosts)
  → Local DNS resolver cache
  → Recursive resolver (ISP / corporate DNS)
  → Root nameserver (.)
  → TLD nameserver (.com)
  → Authoritative nameserver (example.com)
  → Returns IP address → cached at each level
```

### DNS Record Types
| Record | Purpose | Example |
|--------|---------|---------|
| A | Maps domain → IPv4 | `example.com → 93.184.216.34` |
| AAAA | Maps domain → IPv6 | `example.com → 2606:2800:220:1:...` |
| CNAME | Alias to another domain | `www.example.com → example.com` |
| MX | Mail exchange server | `example.com → mail.example.com (pri 10)` |
| NS | Authoritative nameserver | `example.com → ns1.example.com` |
| TXT | Text data (SPF, DKIM, verify) | `v=spf1 include:_spf.google.com` |
| SRV | Service location | `_sip._tcp.example.com → sip.example.com:5060` |
| PTR | Reverse DNS (IP → domain) | `34.216.184.93 → example.com` |
| SOA | Start of Authority | Zone info, serial number, TTLs |

### DNS Commands
```bash
nslookup example.com
nslookup -type=MX example.com

dig example.com +short
dig example.com MX
dig @8.8.8.8 example.com         # Query specific DNS server
dig +trace example.com            # Full resolution path

host example.com
host -t AAAA example.com
```

---

## 6. TCP vs UDP

| Feature       | TCP                        | UDP                       |
|---------------|----------------------------|---------------------------|
| Connection    | Connection-oriented        | Connectionless            |
| Reliability   | Guaranteed delivery (ACK)  | Best-effort (no ACK)     |
| Ordering      | Ordered delivery           | No ordering guarantee     |
| Speed         | Slower (overhead)          | Faster (minimal overhead)|
| Flow Control  | Yes (windowing)            | No                        |
| Use Cases     | HTTP, SSH, FTP, SMTP       | DNS, VoIP, streaming, DHCP|
| Header Size   | 20 bytes                   | 8 bytes                   |

### TCP 3-Way Handshake
```
Client                Server
  |--- SYN ------------>|    1. Client initiates connection
  |<-- SYN-ACK ---------|    2. Server acknowledges + syncs
  |--- ACK ------------>|    3. Client confirms → Connection established
```

### TCP 4-Way Termination
```
Client                Server
  |--- FIN ------------>|    1. Client wants to close
  |<-- ACK -------------|    2. Server acknowledges
  |<-- FIN -------------|    3. Server ready to close
  |--- ACK ------------>|    4. Client confirms → Connection closed
```

---

## 7. Common Ports

| Port | Protocol | Service |
|------|----------|---------|
| 20/21 | TCP | FTP (data/control) |
| 22 | TCP | SSH |
| 25 | TCP | SMTP (email sending) |
| 53 | TCP/UDP | DNS |
| 67/68 | UDP | DHCP (server/client) |
| 80 | TCP | HTTP |
| 110 | TCP | POP3 |
| 143 | TCP | IMAP |
| 443 | TCP | HTTPS |
| 3306 | TCP | MySQL |
| 5432 | TCP | PostgreSQL |
| 6379 | TCP | Redis |
| 8080 | TCP | HTTP Alt / Proxy |
| 8443 | TCP | HTTPS Alt |
| 9090 | TCP | Prometheus |
| 27017 | TCP | MongoDB |

---

## 8. Load Balancing

### Types
- **Layer 4 (Transport):** Routes based on IP address and TCP/UDP port. Faster, no content inspection.
- **Layer 7 (Application):** Routes based on HTTP content—URL path, headers, cookies. Smarter, content-aware.

### Algorithms
| Algorithm | How It Works |
|-----------|-------------|
| Round Robin | Distributes requests equally in rotation |
| Weighted Round Robin | Servers with higher weight get more traffic |
| Least Connections | Sends to the server with fewest active connections |
| IP Hash | Routes based on client IP (sticky sessions) |
| Random | Random server selection |
| Least Response Time | Routes to fastest responding server |

### Nginx Load Balancer Example
```nginx
upstream app_backend {
    least_conn;
    server 10.0.1.10:8080 weight=3;
    server 10.0.1.11:8080 weight=2;
    server 10.0.1.12:8080;
    server 10.0.1.13:8080 backup;    # Used only if others are down
}

server {
    listen 80;
    server_name app.example.com;

    location / {
        proxy_pass http://app_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /api/ {
        proxy_pass http://app_backend;
        proxy_connect_timeout 5s;
        proxy_read_timeout 30s;
    }
}
```

---

## 9. Proxy vs Reverse Proxy

| Feature        | Forward Proxy              | Reverse Proxy              |
|----------------|----------------------------|----------------------------|
| Position       | Client-side                | Server-side                |
| Purpose        | Client anonymity, filtering| Load balancing, caching, SSL|
| Who uses it    | Clients (outbound)         | Servers (inbound)          |
| Hides          | Client identity            | Server identity            |
| Examples       | Squid, corporate proxies   | Nginx, HAProxy, Traefik    |

```
Forward Proxy:
  Client → [Proxy] → Internet → Server
  (client's identity hidden from server)

Reverse Proxy:
  Client → Internet → [Reverse Proxy] → Backend Server(s)
  (server's identity hidden from client)
```

---

## 10. Firewalls & Network Security

```bash
# iptables (legacy)
iptables -A INPUT -p tcp --dport 22 -s 10.0.0.0/8 -j ACCEPT  # Allow SSH from private net
iptables -A INPUT -p tcp --dport 80 -j ACCEPT                 # Allow HTTP
iptables -A INPUT -p tcp --dport 443 -j ACCEPT                # Allow HTTPS
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -j DROP                                      # Drop everything else
iptables -L -n -v                                              # List rules

# firewalld (RHEL/CentOS)
firewall-cmd --add-service=http --permanent
firewall-cmd --add-port=8080/tcp --permanent
firewall-cmd --remove-port=8080/tcp --permanent
firewall-cmd --reload
firewall-cmd --list-all

# UFW (Ubuntu)
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status verbose
```

---

## 11. VPN & Tunneling

```
VPN Types:
  Site-to-Site   → Connects two networks (office ↔ office)
  Client-to-Site → Remote user connects to corporate network
  SSL/TLS VPN    → Browser or app-based (OpenVPN, WireGuard)
  IPSec VPN      → Network-layer encryption (strongSwan)

VPN Protocols:
  WireGuard  → Modern, fast, minimal code
  OpenVPN    → Mature, widely supported, SSL-based
  IPSec/IKEv2 → Enterprise standard
  L2TP       → Often combined with IPSec
```

### SSH Tunneling
```bash
# Local port forwarding (access remote service locally)
ssh -L 8080:db-server:3306 user@jumphost
# Now connect to localhost:8080 → reaches db-server:3306 via jumphost

# Remote port forwarding (expose local service remotely)
ssh -R 9090:localhost:8080 user@remote-server
# Remote server's port 9090 → reaches your localhost:8080

# Dynamic port forwarding (SOCKS proxy)
ssh -D 1080 user@proxy-server
# Configure browser/app to use SOCKS proxy localhost:1080
```

---

## 12. Cheat Sheet

| Command / Concept | Purpose |
|-------------------|---------|
| `ip addr show` | Show IP configuration |
| `ip route show` | Show routing table |
| `ping -c 4 host` | Test connectivity |
| `traceroute host` | Trace packet path |
| `mtr host` | Combined ping + traceroute |
| `dig domain +short` | DNS lookup |
| `nslookup domain` | DNS query |
| `netstat -tulnp` | List open ports and listeners |
| `ss -tulnp` | Modern socket statistics |
| `curl -I url` | HTTP headers |
| `telnet host port` | Test port connectivity |
| `nc -zv host port` | Netcat port check |
| `tcpdump -i eth0` | Packet capture |
| `nmap -sT host` | Port scan |
| `arp -a` | Show ARP table |
| `route -n` | Show routing table (legacy) |
| `/etc/hosts` | Local hostname resolution |
| `/etc/resolv.conf` | DNS server config |
| `iptables -L -n` | List firewall rules |
| `CIDR /24` | 254 usable hosts |
| `CIDR /16` | 65,534 usable hosts |
| TCP port 22 | SSH |
| TCP port 80 | HTTP |
| TCP port 443 | HTTPS |
| TCP port 53 | DNS |

---

## 13. Hands-on Labs

### Lab 1: Configure Nginx as a Reverse Proxy
```bash
# Step 1: Install Nginx
sudo apt update && sudo apt install nginx -y

# Step 2: Create a backend app (using Python for simplicity)
# Terminal 1:
python3 -m http.server 8081 &

# Step 3: Configure Nginx reverse proxy
cat <<'EOF' | sudo tee /etc/nginx/sites-available/reverse-proxy
server {
    listen 80;
    server_name myapp.local;

    location / {
        proxy_pass http://127.0.0.1:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/reverse-proxy /etc/nginx/sites-enabled/
sudo nginx -t   # Test config
sudo systemctl reload nginx

# Step 4: Test
echo "127.0.0.1 myapp.local" | sudo tee -a /etc/hosts
curl http://myapp.local
```

### Lab 2: Firewall Rules with iptables
```bash
# Step 1: Set default policies
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT ACCEPT

# Step 2: Allow loopback
sudo iptables -A INPUT -i lo -j ACCEPT

# Step 3: Allow established connections
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Step 4: Allow SSH only from specific subnet
sudo iptables -A INPUT -p tcp --dport 22 -s 192.168.1.0/24 -j ACCEPT

# Step 5: Allow HTTP and HTTPS
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Step 6: Verify
sudo iptables -L -n -v

# Step 7: Save rules
sudo iptables-save > /etc/iptables.rules
```

### Lab 3: SSH Tunnel to Access a Remote Database
```bash
# Scenario: Access a database on 10.0.2.5:5432 via a jump host 10.0.1.10

# Step 1: Set up local port forwarding
ssh -L 5432:10.0.2.5:5432 user@10.0.1.10 -N -f
# -N = no remote command, -f = background

# Step 2: Connect to the database locally
psql -h localhost -p 5432 -U dbuser -d mydb

# Step 3: Verify the tunnel
ss -tulnp | grep 5432

# Step 4: Kill the tunnel when done
kill $(lsof -t -i:5432)
```

### Lab 4: Subnetting Exercise
```bash
# Exercise: Subnet 10.10.0.0/16 into /24 subnets and assign to departments

# Calculate:
# /16 → 65,534 hosts total
# /24 → 254 hosts per subnet → 256 subnets possible

# Assignment:
# Engineering: 10.10.1.0/24  (10.10.1.1 – 10.10.1.254)
# QA:          10.10.2.0/24  (10.10.2.1 – 10.10.2.254)
# DevOps:      10.10.3.0/24  (10.10.3.1 – 10.10.3.254)
# Management:  10.10.4.0/24  (10.10.4.1 – 10.10.4.254)

# Verify with ipcalc (install: apt install ipcalc)
ipcalc 10.10.1.0/24
```

---

## 14. Real-world Scenarios

### Scenario 1: Connectivity Issue Between Microservices

**Situation:** Service A (10.0.1.10) cannot reach Service B (10.0.2.20:8080) after a network change.

**Troubleshooting Steps:**
```bash
# From Service A:
# 1. Check basic connectivity
ping 10.0.2.20

# 2. Check if the port is reachable
telnet 10.0.2.20 8080
nc -zv 10.0.2.20 8080

# 3. Check routing
ip route show
traceroute 10.0.2.20

# 4. Check DNS (if using hostname)
dig service-b.internal +short
cat /etc/resolv.conf

# 5. Check firewall on Service B
sudo iptables -L -n | grep 8080
sudo ss -tulnp | grep 8080

# 6. Check security groups / NSG (if cloud)
# AWS: check security group inbound rules for port 8080
# Azure: check NSG rules

# 7. Packet capture (last resort)
sudo tcpdump -i eth0 host 10.0.2.20 and port 8080 -c 20
```

### Scenario 2: DNS Resolution Failure in Kubernetes

**Situation:** Pods cannot resolve external domain names.

**Solution:**
```bash
# 1. Check CoreDNS pods
kubectl get pods -n kube-system -l k8s-app=kube-dns

# 2. Test from inside a pod
kubectl run debug --image=busybox --rm -it -- nslookup google.com
kubectl run debug --image=busybox --rm -it -- nslookup kubernetes.default

# 3. Check CoreDNS configmap
kubectl get configmap coredns -n kube-system -o yaml

# 4. Check node's DNS
cat /etc/resolv.conf   # on the node

# 5. Check CoreDNS logs
kubectl logs -n kube-system -l k8s-app=kube-dns --tail=50

# Fix: Ensure CoreDNS has correct upstream DNS forwarders
# and that the pod network can reach DNS servers
```

### Scenario 3: Load Balancer Health Check Failures

**Situation:** Load balancer keeps marking backend servers as unhealthy.

**Solution:**
```bash
# 1. Check the health check endpoint is responding
curl -v http://backend-server:8080/health

# 2. Check the application is running
systemctl status myapp
ss -tulnp | grep 8080

# 3. Check firewall allows health check traffic
# LB health checks often come from the LB's IP range
iptables -L -n | grep 8080

# 4. Check application logs for errors
tail -100 /var/log/myapp/app.log

# 5. Verify health check configuration
# - Correct port and path
# - Timeout is not too aggressive
# - Threshold (unhealthy count) is reasonable

# 6. Test from the LB's perspective
# From another machine in the same network:
curl -o /dev/null -s -w "%{http_code}" http://backend:8080/health
```

---

## 15. Interview Q&A (50 Questions)

### Basic (1–15)

**Q1: What is the OSI model?**
> A 7-layer conceptual framework for understanding network communication: Physical, Data Link, Network, Transport, Session, Presentation, Application. Each layer has specific responsibilities.

**Q2: What is the difference between TCP and UDP?**
> TCP is connection-oriented, reliable, and provides ordered delivery (HTTP, SSH). UDP is connectionless, faster, and used for real-time applications (DNS, VoIP, streaming).

**Q3: What is a subnet mask?**
> A 32-bit number that divides an IP address into a network portion and a host portion. Example: `255.255.255.0` (`/24`) means 254 usable hosts.

**Q4: What is DHCP?**
> Dynamic Host Configuration Protocol—automatically assigns IP addresses, subnet masks, gateways, and DNS servers to devices on a network. Uses UDP ports 67/68.

**Q5: What is the difference between HTTP and HTTPS?**
> HTTPS encrypts data using SSL/TLS over HTTP. HTTP is plaintext (port 80); HTTPS is encrypted (port 443). HTTPS protects against eavesdropping and tampering.

**Q6: What is ARP?**
> Address Resolution Protocol—resolves IP addresses to MAC addresses on a local network. Device broadcasts "Who has 192.168.1.1?" and the owner replies with its MAC.

**Q7: What is NAT?**
> Network Address Translation—translates private IPs to a public IP for internet access. Types: Static NAT (1:1), Dynamic NAT (pool), PAT/NAT overload (many:1 with ports).

**Q8: What is a VLAN?**
> Virtual LAN—logically segments a physical network into isolated broadcast domains. Devices in different VLANs cannot communicate without a router (inter-VLAN routing).

**Q9: What is a default gateway?**
> The router IP that a device sends traffic to when the destination is outside its local subnet. It forwards packets between different networks.

**Q10: Name three important DNS record types.**
> **A** (domain → IPv4), **CNAME** (alias to another domain), **MX** (mail server for a domain). Others: AAAA, NS, TXT, SRV, PTR.

**Q11: What is the TCP 3-way handshake?**
> Connection establishment: 1) Client sends **SYN** 2) Server responds **SYN-ACK** 3) Client sends **ACK**. Connection is now established.

**Q12: What is the difference between a router and a switch?**
> **Router:** Layer 3, routes packets between different networks using IP addresses. **Switch:** Layer 2, forwards frames within the same LAN using MAC addresses.

**Q13: What is ICMP?**
> Internet Control Message Protocol—used for diagnostics and error reporting. `ping` uses ICMP Echo Request/Reply. `traceroute` uses ICMP TTL Exceeded messages.

**Q14: What is a MAC address?**
> A 48-bit hardware address uniquely identifying a network interface. Format: `00:1A:2B:3C:4D:5E`. Burned into the NIC but can be changed in software.

**Q15: What is port forwarding?**
> Redirecting traffic arriving on a specific port/IP to another port/IP. Used to expose internal services externally (e.g., NAT port forwarding, SSH tunnels).

### Intermediate (16–35)

**Q16: Explain how DNS resolution works step by step.**
> Browser cache → OS cache (`/etc/hosts`) → Local DNS resolver → Recursive resolver (ISP) → Root nameserver (.) → TLD nameserver (.com) → Authoritative nameserver → IP returned and cached.

**Q17: What is the difference between Layer 4 and Layer 7 load balancing?**
> **L4:** Routes based on IP/TCP/UDP info (fast, no content inspection). **L7:** Routes based on HTTP content—URL path, headers, cookies, method (smarter, supports content-based routing).

**Q18: What is a CDN?**
> Content Delivery Network—geographically distributed servers that cache and serve content closer to users. Reduces latency, offloads origin servers. Examples: CloudFront, Akamai, Cloudflare.

**Q19: What is SSL/TLS?**
> Protocols for encrypting data in transit. TLS (successor to SSL) provides confidentiality, integrity, and authentication via certificates. Used in HTTPS, SMTPS, etc.

**Q20: How does a reverse proxy work?**
> Sits in front of backend servers. Receives client requests and forwards them to appropriate servers. Benefits: load balancing, SSL termination, caching, hiding backend infrastructure, DDoS protection.

**Q21: What is the difference between TCP TIME_WAIT and CLOSE_WAIT?**
> **TIME_WAIT:** Active closer waits (2×MSL) before final close—prevents delayed packets from being misinterpreted. **CLOSE_WAIT:** Passive closer's application hasn't closed the socket yet.

**Q22: What is BGP?**
> Border Gateway Protocol—the routing protocol of the internet. Routes traffic between Autonomous Systems (AS). Uses path-vector algorithm. Runs on TCP port 179.

**Q23: What is MTU?**
> Maximum Transmission Unit—the largest packet size (bytes) that can traverse a network link. Default: 1500 bytes (Ethernet). Jumbo frames: 9000 bytes. Mismatched MTUs cause fragmentation.

**Q24: What is a socket?**
> An endpoint for network communication defined by: `IP address + port + protocol`. Example: `192.168.1.10:8080/TCP`. Applications create sockets to send/receive data.

**Q25: Stateful vs stateless firewall?**
> **Stateful:** Tracks connection state; automatically allows return traffic for established connections. **Stateless:** Inspects each packet independently; requires explicit rules for both directions.

**Q26: What is a DMZ?**
> Demilitarized Zone—a network segment between the public internet and private internal network. Hosts public-facing services (web servers, mail servers) with restricted access to internal resources.

**Q27: What is CIDR?**
> Classless Inter-Domain Routing—replaces class-based addressing with variable-length subnet masking. Notation: `10.0.0.0/16`. Allows efficient IP allocation and route aggregation.

**Q28: What is a bastion host / jump server?**
> A hardened, publicly accessible server that acts as the single entry point to access resources in a private network via SSH. All administrative access is funneled through it.

**Q29: What is the difference between public and private IP addresses?**
> **Public:** Routable on the internet, globally unique. **Private:** Used within internal networks (10.x, 172.16-31.x, 192.168.x), not routable on the internet, require NAT.

**Q30: How does `traceroute` work?**
> Sends packets with incrementally increasing TTL (1, 2, 3…). Each router that decrements TTL to 0 replies with ICMP "Time Exceeded," revealing its IP. This maps the path to the destination.

**Q31: What is a network namespace?**
> A Linux kernel feature providing an isolated network stack—interfaces, routes, firewall rules, port space. Each container gets its own network namespace. Managed with `ip netns`.

**Q32: What is service discovery?**
> Automatically detecting and registering services on a network. **Client-side:** Consul, etcd. **Server-side:** Load balancer. **DNS-based:** Kubernetes DNS (service.namespace.svc.cluster.local).

**Q33: Unicast vs broadcast vs multicast vs anycast?**
> **Unicast:** One-to-one. **Broadcast:** One-to-all (same subnet). **Multicast:** One-to-many (subscribed group). **Anycast:** One-to-nearest (same IP, multiple locations—used by CDNs).

**Q34: What is SNI?**
> Server Name Indication—a TLS extension where the client includes the target hostname in the handshake. Allows multiple HTTPS sites on a single IP address (the server picks the right certificate).

**Q35: What is a network bridge?**
> A device or software that connects two Layer 2 network segments, forwarding frames based on MAC addresses. Docker uses Linux bridges (`docker0`) for container networking.

### Advanced (36–50)

**Q36: How would you troubleshoot network connectivity issues?**
> 1) `ping` target 2) `traceroute` 3) Check DNS with `dig` 4) Test port with `telnet`/`nc` 5) Check firewall rules 6) Check routing with `ip route` 7) Packet capture with `tcpdump` 8) Check application logs

**Q37: How does TCP handle congestion control?**
> Four algorithms: **Slow Start** (exponential growth), **Congestion Avoidance** (linear growth), **Fast Retransmit** (retransmit on 3 duplicate ACKs), **Fast Recovery** (avoid slow start after loss). Modern: CUBIC, BBR.

**Q38: What is eBPF and how is it used in networking?**
> Extended Berkeley Packet Filter—runs sandboxed programs in the Linux kernel for high-performance packet processing, monitoring, and security. Used by Cilium (K8s CNI) for dataplane, XDP for DDoS mitigation.

**Q39: What is an overlay network?**
> A virtual network built on top of a physical (underlay) network. Encapsulates L2 frames in L3/L4 packets. Used in Docker Swarm, Kubernetes for cross-host container communication. Technologies: VXLAN, Geneve, GRE.

**Q40: What is VXLAN?**
> Virtual Extensible LAN—encapsulates Ethernet frames within UDP packets (port 4789) to create overlay networks across L3 boundaries. Supports up to 16 million network IDs (vs 4096 for VLAN). Used heavily in K8s and cloud networking.

**Q41: What is the difference between iptables and nftables?**
> `nftables` replaces `iptables` with: unified syntax (no separate ip/ip6/arp/ebtables), better performance (reduced kernel transitions), atomic rule updates, and native set support. Uses `nft` command.

**Q42: How does Kubernetes networking work?**
> Core rules: 1) Every pod gets a unique IP 2) Pods communicate without NAT 3) Nodes can communicate with all pods. **Services** provide stable endpoints. **CNI plugins** (Calico, Flannel, Cilium) implement the network.

**Q43: What is a service mesh?**
> A dedicated infrastructure layer for service-to-service communication. Features: mTLS, traffic management, retries, circuit breaking, observability. Uses sidecar proxies (Envoy). Examples: Istio, Linkerd, Consul Connect.

**Q44: What is TCP keepalive?**
> A mechanism to detect dead connections by sending periodic probe packets during idle periods. Linux defaults: wait 7200s, send 9 probes, 75s apart. Tunable via `sysctl net.ipv4.tcp_keepalive_*`.

**Q45: What is the difference between L2 and L3 VPN?**
> **L2 VPN:** Extends Layer 2 across sites—remote devices appear on the same LAN (VPLS, L2TP). **L3 VPN:** Routes between sites at Layer 3—separate subnets (IPSec, MPLS L3VPN). L3 is more common and scalable.

**Q46: What is anycast?**
> A routing technique where the same IP is announced from multiple locations. Traffic is routed to the nearest one (by BGP path). Used by CDNs (Cloudflare), DNS roots, and DDoS scrubbing centers.

**Q47: How does mTLS (mutual TLS) work?**
> Both client and server present and verify certificates. Flow: 1) Server sends its cert 2) Client verifies 3) Client sends its cert 4) Server verifies. Provides mutual authentication. Used in service meshes for zero-trust.

**Q48: What is a network policy in Kubernetes?**
> A resource that controls pod-to-pod traffic at IP/port level. Default: all traffic allowed. Policies are additive (whitelist). Requires a CNI plugin that supports them (Calico, Cilium, Weave Net).

**Q49: How would you capture and analyze network traffic?**
> Capture: `tcpdump -i eth0 -w capture.pcap host 10.0.1.5 and port 443`. Analyze: Open `capture.pcap` in Wireshark. Filter: `tcp.port == 443 && ip.addr == 10.0.1.5`. Use `tshark` for CLI analysis.

**Q50: What is SD-WAN?**
> Software-Defined Wide Area Network—uses software to manage WAN connections, select optimal paths, and apply policies. Benefits over MPLS: lower cost, easier management, supports internet + LTE + MPLS simultaneously.

---

*Last updated: April 2026*
