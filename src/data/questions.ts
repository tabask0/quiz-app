import type { Question } from "@/types/quiz";

// Comprehensive networking questions with coding challenges
const obfuscatedQuestions: Question[] = [
  // Multiple Choice Questions (1-30)
  {
    id: 0x1a2b,
    question: "What is the primary purpose of the OSI model?",
    options: [
      "To standardize network communication protocols",
      "To create faster internet connections",
      "To reduce network security vulnerabilities",
      "To simplify hardware manufacturing",
    ],
    correctAnswers: [0],
    type: "single" as const,
    category: "Fundamentals",
  },
  {
    id: 0x3c4d,
    question:
      "Which of the following are valid IP address ranges for private networks?",
    options: [
      "10.0.0.0/8",
      "172.16.0.0/12",
      "192.168.0.0/16",
      "169.254.0.0/16",
    ],
    correctAnswers: [0, 1, 2],
    type: "multiple" as const,
    category: "IP Addressing",
  },
  {
    id: 0x5e6f,
    question: "What is the main difference between TCP and UDP?",
    options: [
      "TCP is faster than UDP",
      "TCP provides reliable delivery, UDP does not",
      "UDP uses more bandwidth than TCP",
      "TCP only works on local networks",
    ],
    correctAnswers: [1],
    type: "single" as const,
    category: "Protocols",
  },
  {
    id: 0x7a8b,
    question:
      "Which protocols operate at the Network layer (Layer 3) of the OSI model?",
    options: ["IP", "ICMP", "ARP", "HTTP"],
    correctAnswers: [0, 1],
    type: "multiple" as const,
    category: "OSI Model",
  },
  {
    id: 0x9c0d,
    question: "What is the purpose of a subnet mask?",
    options: [
      "To encrypt network traffic",
      "To determine which portion of an IP address is the network ID",
      "To increase network speed",
      "To prevent unauthorized access",
    ],
    correctAnswers: [1],
    type: "single" as const,
    category: "Subnetting",
  },
  {
    id: 0xae1f,
    question: "Which of the following are characteristics of a switch?",
    options: [
      "Operates at Layer 2 of the OSI model",
      "Creates collision domains",
      "Uses MAC addresses for forwarding decisions",
      "Broadcasts traffic to all ports",
    ],
    correctAnswers: [0, 2],
    type: "multiple" as const,
    category: "Network Devices",
  },
  {
    id: 0xbf2c,
    question: "What is the default port number for HTTPS?",
    options: ["80", "443", "8080", "21"],
    correctAnswers: [1],
    type: "single" as const,
    category: "Ports & Services",
  },
  {
    id: 0xcd3e,
    question: "Which of the following are routing protocols?",
    options: ["OSPF", "BGP", "RIP", "STP"],
    correctAnswers: [0, 1, 2],
    type: "multiple" as const,
    category: "Routing",
  },
  {
    id: 0xde4f,
    question: "What does VLAN stand for?",
    options: [
      "Virtual Local Area Network",
      "Very Large Area Network",
      "Variable Length Address Network",
      "Verified Local Access Network",
    ],
    correctAnswers: [0],
    type: "single" as const,
    category: "VLANs",
  },
  {
    id: 0xef5a,
    question: "Which of the following are benefits of using VLANs?",
    options: [
      "Improved security through network segmentation",
      "Reduced broadcast traffic",
      "Simplified network management",
      "Increased network speed",
    ],
    correctAnswers: [0, 1, 2],
    type: "multiple" as const,
    category: "VLANs",
  },
  {
    id: 0x1234,
    question: "What layer of the OSI model does a switch operate at?",
    options: ["Layer 1", "Layer 2", "Layer 3", "Layer 4"],
    correctAnswers: [1],
    type: "single" as const,
    category: "OSI Model",
  },
  {
    id: 0x5678,
    question: "Which of the following are Class A IP address ranges?",
    options: [
      "1.0.0.0 - 126.255.255.255",
      "128.0.0.0 - 191.255.255.255",
      "192.0.0.0 - 223.255.255.255",
      "224.0.0.0 - 239.255.255.255",
    ],
    correctAnswers: [0],
    type: "single" as const,
    category: "IP Addressing",
  },
  {
    id: 0x9abc,
    question: "What is the default port for DNS?",
    options: ["53", "80", "443", "25"],
    correctAnswers: [0],
    type: "single" as const,
    category: "Ports & Services",
  },
  {
    id: 0xdef0,
    question: "Which of the following are types of firewalls?",
    options: [
      "Packet Filtering",
      "Stateful Inspection",
      "Application Layer",
      "All of the above",
    ],
    correctAnswers: [3],
    type: "single" as const,
    category: "Security",
  },
  {
    id: 0x2468,
    question:
      "What is the primary purpose of NAT (Network Address Translation)?",
    options: [
      "To encrypt data packets",
      "To allow multiple devices to share a single public IP address",
      "To increase network speed",
      "To prevent network loops",
    ],
    correctAnswers: [1],
    type: "single" as const,
    category: "NAT",
  },
  {
    id: 0x1357,
    question: "Which of the following are load balancing algorithms?",
    options: [
      "Round Robin",
      "Least Connections",
      "Weighted Round Robin",
      "All of the above",
    ],
    correctAnswers: [3],
    type: "single" as const,
    category: "Load Balancing",
  },
  {
    id: 0x9bdf,
    question: "What are the main VPN protocols?",
    options: ["IPSec", "OpenVPN", "L2TP", "All of the above"],
    correctAnswers: [3],
    type: "single" as const,
    category: "VPN",
  },
  {
    id: 0xace8,
    question: "Which network topology provides the highest redundancy?",
    options: ["Star", "Bus", "Ring", "Mesh"],
    correctAnswers: [3],
    type: "single" as const,
    category: "Topology",
  },
  {
    id: 0x1111,
    question: "What is a MAC address?",
    options: [
      "A unique identifier for network interfaces",
      "A type of IP address",
      "A routing protocol",
      "A security certificate",
    ],
    correctAnswers: [0],
    type: "single" as const,
    category: "Fundamentals",
  },
  {
    id: 0x2222,
    question: "What does ARP stand for?",
    options: [
      "Address Resolution Protocol",
      "Automatic Route Protocol",
      "Advanced Routing Protocol",
      "Application Response Protocol",
    ],
    correctAnswers: [0],
    type: "single" as const,
    category: "Protocols",
  },
  {
    id: 0x3333,
    question:
      "Which of the following are benefits of using switches over hubs?",
    options: [
      "Reduced collision domains",
      "Better performance",
      "Full-duplex communication",
      "All of the above",
    ],
    correctAnswers: [3],
    type: "single" as const,
    category: "Network Devices",
  },
  {
    id: 0x4444,
    question: "What is the purpose of a default gateway?",
    options: [
      "To encrypt network traffic",
      "To route traffic to other networks",
      "To provide DNS services",
      "To authenticate users",
    ],
    correctAnswers: [1],
    type: "single" as const,
    category: "Routing",
  },
  {
    id: 0x5555,
    question: "Which protocol is used for email transmission?",
    options: ["HTTP", "FTP", "SMTP", "SNMP"],
    correctAnswers: [2],
    type: "single" as const,
    category: "Protocols",
  },
  {
    id: 0x6666,
    question: "What is the difference between a router and a switch?",
    options: [
      "Routers operate at Layer 3, switches at Layer 2",
      "Switches are faster than routers",
      "Routers can only connect two networks",
      "There is no difference",
    ],
    correctAnswers: [0],
    type: "single" as const,
    category: "Network Devices",
  },
  {
    id: 0x7777,
    question: "Which of the following are wireless security protocols?",
    options: ["WEP", "WPA", "WPA2", "All of the above"],
    correctAnswers: [3],
    type: "single" as const,
    category: "Wireless Security",
  },
  {
    id: 0x8888,
    question: "What is the purpose of DHCP?",
    options: [
      "To provide automatic IP address assignment",
      "To encrypt network traffic",
      "To route packets between networks",
      "To authenticate users",
    ],
    correctAnswers: [0],
    type: "single" as const,
    category: "DHCP",
  },
  {
    id: 0x9999,
    question: "Which layer of the OSI model handles encryption?",
    options: ["Layer 2", "Layer 3", "Layer 4", "Layer 6"],
    correctAnswers: [3],
    type: "single" as const,
    category: "OSI Model",
  },
  {
    id: 0xaaaa,
    question: "What is the maximum number of hosts in a /24 subnet?",
    options: ["254", "255", "256", "512"],
    correctAnswers: [0],
    type: "single" as const,
    category: "Subnetting",
  },
  {
    id: 0xbbbb,
    question: "Which protocol is used for network management?",
    options: ["HTTP", "FTP", "SNMP", "SMTP"],
    correctAnswers: [2],
    type: "single" as const,
    category: "Network Management",
  },
  {
    id: 0xcccc,
    question: "What is the purpose of QoS (Quality of Service)?",
    options: [
      "To prioritize network traffic",
      "To encrypt data",
      "To route packets",
      "To authenticate users",
    ],
    correctAnswers: [0],
    type: "single" as const,
    category: "QoS",
  },

  // Coding Questions (31-40)
  {
    id: 0xdddd,
    question:
      "Write a Python function to calculate subnet information given an IP address and CIDR notation. The function should return the network address and broadcast address.",
    type: "coding" as const,
    category: "Subnetting",
    language: "python",
    placeholder:
      "def calculate_subnet(ip, cidr):\n    # Your code here\n    pass",
    correctCode: `import ipaddress

def calculate_subnet(ip, cidr):
    network = ipaddress.IPv4Network(f"{ip}/{cidr}", strict=False)
    return str(network.network_address), str(network.broadcast_address)`,
  },
  {
    id: 0xeeee,
    question:
      "Create a Python function to scan a range of ports on a given host. The function should return a list of open ports.",
    type: "coding" as const,
    category: "Network Security",
    language: "python",
    placeholder:
      "def scan_port_range(host, start_port, end_port):\n    # Your code here\n    pass",
    correctCode: `import socket

def scan_port_range(host, start_port, end_port):
    open_ports = []
    for port in range(start_port, end_port + 1):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex((host, port))
            if result == 0:
                open_ports.append(port)
            sock.close()
        except:
            pass
    return open_ports`,
  },
  {
    id: 0xffff,
    question:
      "Write a Python function to validate if a given string is a valid IP address.",
    type: "coding" as const,
    category: "IP Validation",
    language: "python",
    placeholder: "def is_valid_ip(ip):\n    # Your code here\n    pass",
    correctCode: `import re

def is_valid_ip(ip):
    pattern = r'^(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})$'
    match = re.match(pattern, ip)
    if not match:
        return False
    return all(0 <= int(octet) <= 255 for octet in match.groups())`,
    scoringCriteria: {
      requiredKeywords: ["import", "re", "def", "pattern", "match", "return"],
      requiredPatterns: ["\\d{1,3}", "\\\\.", "int", "octet", "255"],
      minScore: 60,
    },
  },
  {
    id: 0x0000,
    question:
      "Create a Python function to get network interface information using system commands.",
    type: "coding" as const,
    category: "Network Configuration",
    language: "python",
    placeholder:
      "def get_network_interfaces():\n    # Your code here\n    pass",
    correctCode: `import subprocess

def get_network_interfaces():
    try:
        result = subprocess.run(['ip', 'addr', 'show'], capture_output=True, text=True)
        return result.stdout
    except:
        return "Error: Could not retrieve network interfaces"`,
    scoringCriteria: {
      requiredKeywords: [
        "import",
        "subprocess",
        "def",
        "run",
        "capture_output",
        "text",
      ],
      requiredPatterns: ["ip", "addr", "show", "stdout"],
      minScore: 50,
    },
  },
  {
    id: 0x1112,
    question:
      "Write a Python function to ping a host and return whether it's reachable.",
    type: "coding" as const,
    category: "Network Testing",
    language: "python",
    placeholder:
      "def ping_host(host, count=4):\n    # Your code here\n    pass",
    correctCode: `import subprocess

def ping_host(host, count=4):
    try:
        result = subprocess.run(['ping', '-c', str(count), host], 
                              capture_output=True, text=True)
        return result.returncode == 0
    except:
        return False`,
  },
  {
    id: 0x2223,
    question:
      "Create a Python function to perform a DNS lookup for a given domain name.",
    type: "coding" as const,
    category: "DNS",
    language: "python",
    placeholder: "def dns_lookup(domain):\n    # Your code here\n    pass",
    correctCode: `import socket

def dns_lookup(domain):
    try:
        ip = socket.gethostbyname(domain)
        return ip
    except socket.gaierror:
        return None`,
  },
  {
    id: 0x3334,
    question:
      "Write a Python function to get network statistics using netstat command.",
    type: "coding" as const,
    category: "Network Monitoring",
    language: "python",
    placeholder: "def get_network_stats():\n    # Your code here\n    pass",
    correctCode: `import subprocess

def get_network_stats():
    try:
        result = subprocess.run(['netstat', '-i'], capture_output=True, text=True)
        return result.stdout
    except:
        return "Error: Could not retrieve network statistics"`,
  },
  {
    id: 0x4445,
    question:
      "Create a Python function to check SSL certificate information for a given hostname.",
    type: "coding" as const,
    category: "SSL/TLS",
    language: "python",
    placeholder:
      "def check_ssl_certificate(hostname, port=443):\n    # Your code here\n    pass",
    correctCode: `import ssl
import socket

def check_ssl_certificate(hostname, port=443):
    try:
        context = ssl.create_default_context()
        with socket.create_connection((hostname, port)) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                return cert
    except:
        return None`,
  },
  {
    id: 0x5556,
    question:
      "Write a Python function to measure network latency to a given host.",
    type: "coding" as const,
    category: "Network Performance",
    language: "python",
    placeholder:
      "def measure_latency(host, count=5):\n    # Your code here\n    pass",
    correctCode: `import time
import subprocess

def measure_latency(host, count=5):
    latencies = []
    for _ in range(count):
        start = time.time()
        result = subprocess.run(['ping', '-c', '1', host], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            latencies.append((time.time() - start) * 1000)
    return sum(latencies) / len(latencies) if latencies else None`,
  },
  {
    id: 0x6667,
    question:
      "Create a Python function to perform comprehensive network diagnostics including IP configuration, routing, and connectivity tests.",
    type: "coding" as const,
    category: "Network Troubleshooting",
    language: "python",
    placeholder: "def network_diagnostics():\n    # Your code here\n    pass",
    correctCode: `import subprocess

def network_diagnostics():
    commands = [
        ['ip', 'addr', 'show'],
        ['ip', 'route', 'show'],
        ['ping', '-c', '3', '8.8.8.8'],
        ['nslookup', 'google.com']
    ]
    results = {}
    for cmd in commands:
        try:
            result = subprocess.run(cmd, capture_output=True, text=True)
            results[' '.join(cmd)] = result.stdout
        except:
            results[' '.join(cmd)] = "Error executing command"
    return results`,
  },
];

// Obfuscation function to scramble answers
function obfuscateAnswers(questions: Question[]) {
  return questions.map((q) => ({
    ...q,
    correctAnswers:
      q.correctAnswers?.map((ans: number) => (ans + 0x1f2e) ^ 0xabcd) || [],
  }));
}

// Deobfuscation function
function deobfuscateAnswers(obfuscated: number[]): number[] {
  return obfuscated?.map((ans) => (ans ^ 0xabcd) - 0x1f2e) || [];
}

export const questions = obfuscateAnswers(obfuscatedQuestions);
export { deobfuscateAnswers };
