
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CyberCard from '@/components/common/CyberCard';
import TerminalOutput from '@/components/common/TerminalOutput';
import StatusBadge from '@/components/common/StatusBadge';
import { Wifi, Loader, Radio, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NetworkScan: React.FC = () => {
  const { toast } = useToast();
  const [targetNetwork, setTargetNetwork] = useState('192.168.1.0/24');
  const [scanInProgress, setScanInProgress] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [discoveredHosts, setDiscoveredHosts] = useState<any[]>([]);
  
  // Advanced scan options
  const [scanOptions, setScanOptions] = useState({
    // NMAP scan techniques
    tcpSyn: true,      // -sS
    tcpConnect: false, // -sT
    udpScan: false,    // -sU
    tcpNull: false,    // -sN
    tcpFin: false,     // -sF
    tcpXmas: false,    // -sX
    tcpAck: false,     // -sA
    tcpWindow: false,  // -sW
    tcpMaimon: false,  // -sM
    serviceScan: true, // -sV
    osScan: true,      // -O
    
    // Advanced options
    timing: "normal",  // T0-T5
    aggressive: false, // -A
    allPorts: false,   // -p-
    ipv6: false,       // -6
    noHostDiscovery: false, // -Pn
    skipDnsResolution: false, // -n
  });

  const handleOptionChange = (option: string) => {
    setScanOptions(prev => ({
      ...prev,
      [option]: !prev[option as keyof typeof prev]
    }));
  };

  const handleSelectChange = (option: string, value: string) => {
    setScanOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const startNetworkScan = () => {
    if (!targetNetwork) {
      toast({
        title: "Input Error",
        description: "Please enter a target network to scan",
        variant: "destructive"
      });
      return;
    }

    setScanInProgress(true);
    setScanCompleted(false);
    setScanProgress(0);
    
    // Create NMAP command based on selected options
    let nmapCommand = 'nmap';
    
    // Add scan techniques
    if (scanOptions.tcpSyn) nmapCommand += ' -sS';
    if (scanOptions.tcpConnect) nmapCommand += ' -sT';
    if (scanOptions.udpScan) nmapCommand += ' -sU';
    if (scanOptions.tcpNull) nmapCommand += ' -sN';
    if (scanOptions.tcpFin) nmapCommand += ' -sF';
    if (scanOptions.tcpXmas) nmapCommand += ' -sX';
    if (scanOptions.tcpAck) nmapCommand += ' -sA';
    if (scanOptions.tcpWindow) nmapCommand += ' -sW';
    if (scanOptions.tcpMaimon) nmapCommand += ' -sM';
    if (scanOptions.serviceScan) nmapCommand += ' -sV';
    if (scanOptions.osScan) nmapCommand += ' -O';
    
    // Add advanced options
    if (scanOptions.aggressive) nmapCommand += ' -A';
    if (scanOptions.allPorts) nmapCommand += ' -p-';
    if (scanOptions.ipv6) nmapCommand += ' -6';
    if (scanOptions.noHostDiscovery) nmapCommand += ' -Pn';
    if (scanOptions.skipDnsResolution) nmapCommand += ' -n';
    
    // Add timing template
    nmapCommand += ` -T${
      scanOptions.timing === 'paranoid' ? '0' :
      scanOptions.timing === 'sneaky' ? '1' :
      scanOptions.timing === 'polite' ? '2' :
      scanOptions.timing === 'normal' ? '3' :
      scanOptions.timing === 'aggressive' ? '4' : '5'
    }`;
    
    // Add target
    nmapCommand += ` ${targetNetwork}`;
    
    setTerminalOutput([
      `Starting comprehensive network scan on target: ${targetNetwork}`,
      `Command: ${nmapCommand}`,
      `Initializing scan engine...`,
      `Sending packets to discover live hosts...`
    ]);
    setDiscoveredHosts([]);

    // Simulate scan progress
    const intervalId = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 3);
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);

    // Determine scan duration based on options (simulate more thorough scans taking longer)
    const baseTimeout = 4000;
    const techniqueCount = Object.values(scanOptions).filter(v => v === true).length;
    const scanDuration = baseTimeout + (techniqueCount * 500) + (
      scanOptions.timing === 'insane' ? 0 :
      scanOptions.timing === 'aggressive' ? 1000 :
      scanOptions.timing === 'normal' ? 2000 :
      scanOptions.timing === 'polite' ? 3000 :
      scanOptions.timing === 'sneaky' ? 4000 : 5000
    );

    // Add status updates
    const statusTimeouts: NodeJS.Timeout[] = [];
    const statusMessages = [
      { time: scanDuration * 0.2, message: `Sending ${scanOptions.tcpSyn ? 'SYN' : 'TCP'} packets...` },
      { time: scanDuration * 0.3, message: 'Processing initial responses...' },
      { time: scanDuration * 0.4, message: `${scanOptions.osScan ? 'Fingerprinting operating systems...' : 'Continuing network discovery...'}` },
      { time: scanDuration * 0.5, message: `${scanOptions.serviceScan ? 'Identifying services on open ports...' : 'Continuing scan...'}` },
      { time: scanDuration * 0.6, message: 'Analyzing responses...' },
      { time: scanDuration * 0.7, message: 'Processing host details...' },
      { time: scanDuration * 0.8, message: 'Finalizing scan results...' }
    ];

    statusMessages.forEach(({ time, message }) => {
      const timeout = setTimeout(() => {
        setTerminalOutput(prev => [...prev, message]);
      }, time);
      statusTimeouts.push(timeout);
    });

    // Generate more detailed mock hosts based on scan options
    const finalTimeout = setTimeout(() => {
      clearInterval(intervalId);
      setScanProgress(100);
      setScanInProgress(false);
      setScanCompleted(true);
      
      const mockHosts = generateMockHosts(scanOptions);
      setDiscoveredHosts(mockHosts);
      
      setTerminalOutput(prev => [...prev, 
        `Network scan completed. Found ${mockHosts.length} live hosts.`,
        `Scan completed in ${(scanDuration / 1000).toFixed(1)} seconds.`
      ]);
      
      toast({
        title: "Network Scan Complete",
        description: `Found ${mockHosts.length} hosts on ${targetNetwork}`,
      });
    }, scanDuration);
    
    return () => {
      clearInterval(intervalId);
      statusTimeouts.forEach(id => clearTimeout(id));
      clearTimeout(finalTimeout);
    };
  };

  // Generate mock hosts based on scan options
  const generateMockHosts = (options: typeof scanOptions) => {
    const baseHosts = [
      { 
        ip: '192.168.1.1', 
        mac: '00:11:22:33:44:55', 
        hostname: 'Gateway', 
        status: 'up', 
        latency: '2ms', 
        vendor: 'Cisco',
        os: 'Cisco IOS 15.4',
        vulns: []
      },
      { 
        ip: '192.168.1.5', 
        mac: '11:22:33:44:55:66', 
        hostname: 'Desktop-PC', 
        status: 'up', 
        latency: '3ms', 
        vendor: 'Dell',
        os: 'Windows 10 Pro 21H2',
        vulns: [
          { id: 'CVE-2023-3466', name: 'Windows RDP Vulnerability', severity: 'high' }
        ]
      },
      { 
        ip: '192.168.1.10', 
        mac: '22:33:44:55:66:77', 
        hostname: 'Laptop-Alice', 
        status: 'up', 
        latency: '5ms', 
        vendor: 'Apple',
        os: 'macOS 13.1',
        vulns: []
      },
      { 
        ip: '192.168.1.15', 
        mac: '33:44:55:66:77:88', 
        hostname: 'Server01', 
        status: 'up', 
        latency: '1ms', 
        vendor: 'HP',
        os: 'Ubuntu Server 22.04 LTS',
        vulns: [
          { id: 'CVE-2023-2522', name: 'OpenSSH Authentication Bypass', severity: 'medium' },
          { id: 'CVE-2023-4567', name: 'Apache HTTPd 2.4.52 RCE', severity: 'high' }
        ]
      },
      { 
        ip: '192.168.1.20', 
        mac: '44:55:66:77:88:99', 
        hostname: 'IoT-Device', 
        status: 'up', 
        latency: '8ms', 
        vendor: 'TP-Link',
        os: 'Linux-based Firmware v3.2',
        vulns: [
          { id: 'CVE-2022-1234', name: 'Default Credentials', severity: 'high' }
        ]
      },
      { 
        ip: '192.168.1.25', 
        mac: '55:66:77:88:99:AA', 
        hostname: 'PrinterMain', 
        status: 'up', 
        latency: '4ms', 
        vendor: 'HP',
        os: 'HP Printer Firmware v2.10.5',
        vulns: [
          { id: 'CVE-2023-7655', name: 'Printer Firmware Authentication Bypass', severity: 'medium' }
        ]
      },
      { 
        ip: '192.168.1.30', 
        mac: '66:77:88:99:AA:BB', 
        hostname: 'NAS-Storage', 
        status: 'up', 
        latency: '3ms', 
        vendor: 'Synology',
        os: 'DSM 7.1.1',
        vulns: []
      },
      { 
        ip: '192.168.1.35', 
        mac: '77:88:99:AA:BB:CC', 
        hostname: 'SmartTV-Living', 
        status: 'up', 
        latency: '7ms', 
        vendor: 'Samsung',
        os: 'Tizen OS 4.0',
        vulns: [
          { id: 'CVE-2022-9988', name: 'Smart TV Information Disclosure', severity: 'low' }
        ]
      }
    ];
    
    // Get a random selection of hosts, more hosts if aggressive scanning is enabled
    const hostsCount = options.aggressive ? 
                       Math.floor(Math.random() * 5) + 8 : 
                       Math.floor(Math.random() * 3) + 5;
    
    let selectedHosts = [...baseHosts];
    
    // Shuffle and take the requested number of hosts
    selectedHosts.sort(() => Math.random() - 0.5);
    selectedHosts = selectedHosts.slice(0, hostsCount);
    
    // Enhance hosts with service information if service scan is enabled
    if (options.serviceScan) {
      selectedHosts = selectedHosts.map(host => {
        let services: any[] = [];
        
        // Different hosts have different services
        if (host.hostname.includes('Server')) {
          services = [
            { port: 22, name: 'ssh', version: 'OpenSSH 8.9p1', state: 'open' },
            { port: 80, name: 'http', version: 'Apache httpd 2.4.52', state: 'open' },
            { port: 443, name: 'https', version: 'Apache httpd 2.4.52', state: 'open' },
            { port: 3306, name: 'mysql', version: 'MySQL 8.0.28', state: 'open' }
          ];
        } else if (host.hostname.includes('Gateway')) {
          services = [
            { port: 22, name: 'ssh', version: 'dropbear sshd', state: 'open' },
            { port: 80, name: 'http', version: 'lighttpd 1.4.59', state: 'open' },
            { port: 53, name: 'domain', version: 'dnsmasq 2.85', state: 'open' }
          ];
        } else if (host.hostname.includes('Desktop') || host.hostname.includes('Laptop')) {
          services = [
            { port: 139, name: 'netbios-ssn', version: 'Microsoft Windows netbios-ssn', state: 'open' },
            { port: 445, name: 'microsoft-ds', version: 'Microsoft Windows Share', state: 'open' }
          ];
          
          // Some hosts may have more services by random chance
          if (Math.random() > 0.5) {
            services.push({ port: 3389, name: 'ms-wbt-server', version: 'Microsoft Terminal Services', state: 'open' });
          }
        } else if (host.hostname.includes('Printer')) {
          services = [
            { port: 80, name: 'http', version: 'HP HTTP Server', state: 'open' },
            { port: 443, name: 'https', version: 'HP HTTPS Server', state: 'open' },
            { port: 631, name: 'ipp', version: 'CUPS 2.3.3', state: 'open' },
            { port: 9100, name: 'jetdirect', version: 'HP JetDirect', state: 'open' }
          ];
        } else if (host.hostname.includes('NAS')) {
          services = [
            { port: 80, name: 'http', version: 'nginx', state: 'open' },
            { port: 443, name: 'https', version: 'nginx', state: 'open' },
            { port: 22, name: 'ssh', version: 'OpenSSH 7.9p1', state: 'open' },
            { port: 445, name: 'microsoft-ds', version: 'Samba smbd 4.13.2', state: 'open' }
          ];
        } else {
          // Generic services for other device types
          const genericServices = [
            { port: 80, name: 'http', version: 'lighttpd', state: 'open' }
          ];
          
          // Add random services if aggressive scan
          if (options.aggressive && Math.random() > 0.5) {
            genericServices.push({ port: 22, name: 'ssh', version: 'dropbear', state: 'open' });
          }
          
          services = genericServices;
        }
        
        // Add UDP services if UDP scan is enabled
        if (options.udpScan) {
          if (host.hostname.includes('Gateway')) {
            services.push({ port: 53, name: 'domain', version: 'dnsmasq 2.85', state: 'open', protocol: 'udp' });
            services.push({ port: 67, name: 'dhcps', version: '', state: 'open', protocol: 'udp' });
          }
          
          // SNMP is commonly open on many devices
          if (Math.random() > 0.7) {
            services.push({ port: 161, name: 'snmp', version: 'SNMPv2c', state: 'open', protocol: 'udp' });
          }
        }
        
        // Filter out some services for non-aggressive scans to simulate less thorough results
        if (!options.aggressive && services.length > 2) {
          services = services.slice(0, Math.ceil(services.length * 0.7));
        }
        
        return {
          ...host,
          services
        };
      });
    }
    
    // Enrich with OS details if OS scan is enabled
    if (options.osScan) {
      selectedHosts = selectedHosts.map(host => {
        let osDetails = '';
        
        if (host.os.includes('Windows')) {
          osDetails = 'Windows NT 10.0; Windows 10 Pro 21H2; Microsoft Windows 10 1.0';
        } else if (host.os.includes('macOS')) {
          osDetails = 'Darwin 22.3.0; macOS 13.1; Apple macOS';
        } else if (host.os.includes('Ubuntu')) {
          osDetails = 'Linux 5.15.0-67-generic; Ubuntu 22.04.2 LTS; Canonical';
        } else if (host.os.includes('Cisco')) {
          osDetails = 'Cisco IOS 15.4; Cisco Systems';
        } else {
          osDetails = 'Generic OS details not available';
        }
        
        return {
          ...host,
          osDetails
        };
      });
    }
    
    return selectedHosts;
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Wifi className="text-cyber-blue" />
          Advanced Network Scanner
        </h1>
        <p className="text-muted-foreground">
          Discover and fingerprint live hosts using comprehensive NMAP techniques
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CyberCard title="Network Scan Configuration">
            <div className="space-y-4">
              <div>
                <label htmlFor="target" className="block text-sm font-medium mb-1">
                  Target Network (CIDR notation)
                </label>
                <Input
                  id="target"
                  value={targetNetwork}
                  onChange={(e) => setTargetNetwork(e.target.value)}
                  placeholder="e.g. 192.168.1.0/24"
                  className="bg-muted"
                />
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="text-sm font-medium mb-3">NMAP Scan Techniques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="tcpSyn" 
                      checked={scanOptions.tcpSyn}
                      onCheckedChange={() => handleOptionChange('tcpSyn')}
                    />
                    <Label htmlFor="tcpSyn" className="text-sm">TCP SYN Scan (-sS)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="tcpConnect" 
                      checked={scanOptions.tcpConnect}
                      onCheckedChange={() => handleOptionChange('tcpConnect')}
                    />
                    <Label htmlFor="tcpConnect" className="text-sm">TCP Connect Scan (-sT)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="udpScan" 
                      checked={scanOptions.udpScan}
                      onCheckedChange={() => handleOptionChange('udpScan')}
                    />
                    <Label htmlFor="udpScan" className="text-sm">UDP Scan (-sU)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="tcpNull" 
                      checked={scanOptions.tcpNull}
                      onCheckedChange={() => handleOptionChange('tcpNull')}
                    />
                    <Label htmlFor="tcpNull" className="text-sm">TCP NULL Scan (-sN)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="tcpFin" 
                      checked={scanOptions.tcpFin}
                      onCheckedChange={() => handleOptionChange('tcpFin')}
                    />
                    <Label htmlFor="tcpFin" className="text-sm">TCP FIN Scan (-sF)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="tcpXmas" 
                      checked={scanOptions.tcpXmas}
                      onCheckedChange={() => handleOptionChange('tcpXmas')}
                    />
                    <Label htmlFor="tcpXmas" className="text-sm">TCP XMAS Scan (-sX)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="serviceScan" 
                      checked={scanOptions.serviceScan}
                      onCheckedChange={() => handleOptionChange('serviceScan')}
                    />
                    <Label htmlFor="serviceScan" className="text-sm">Service Version Detection (-sV)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="osScan" 
                      checked={scanOptions.osScan}
                      onCheckedChange={() => handleOptionChange('osScan')}
                    />
                    <Label htmlFor="osScan" className="text-sm">OS Detection (-O)</Label>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="text-sm font-medium mb-3">Advanced Options</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="aggressive" 
                        checked={scanOptions.aggressive}
                        onCheckedChange={() => handleOptionChange('aggressive')}
                      />
                      <Label htmlFor="aggressive" className="text-sm">Aggressive Scan (-A)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="allPorts" 
                        checked={scanOptions.allPorts}
                        onCheckedChange={() => handleOptionChange('allPorts')}
                      />
                      <Label htmlFor="allPorts" className="text-sm">All Ports (-p-)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="noHostDiscovery" 
                        checked={scanOptions.noHostDiscovery}
                        onCheckedChange={() => handleOptionChange('noHostDiscovery')}
                      />
                      <Label htmlFor="noHostDiscovery" className="text-sm">No Host Discovery (-Pn)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="skipDnsResolution" 
                        checked={scanOptions.skipDnsResolution}
                        onCheckedChange={() => handleOptionChange('skipDnsResolution')}
                      />
                      <Label htmlFor="skipDnsResolution" className="text-sm">Skip DNS Resolution (-n)</Label>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="timing" className="block text-sm font-medium mb-1">
                      Timing Template (-T)
                    </label>
                    <select
                      id="timing"
                      value={scanOptions.timing}
                      onChange={(e) => handleSelectChange('timing', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="paranoid">T0 - Paranoid (Very slow, IDS evasion)</option>
                      <option value="sneaky">T1 - Sneaky (Slow, IDS evasion)</option>
                      <option value="polite">T2 - Polite (Slower, conserves bandwidth)</option>
                      <option value="normal">T3 - Normal (Default speed)</option>
                      <option value="aggressive">T4 - Aggressive (Faster)</option>
                      <option value="insane">T5 - Insane (Very fast, may overwhelm targets)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={startNetworkScan}
                disabled={scanInProgress}
                className="bg-cyber-blue text-black hover:bg-cyber-blue/80"
              >
                {scanInProgress ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  'Start Network Scan'
                )}
              </Button>
              
              {scanInProgress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Scan Progress</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <Progress value={scanProgress} className="h-2" />
                </div>
              )}
            </div>
          </CyberCard>

          <CyberCard title="Terminal Output">
            <TerminalOutput 
              content={terminalOutput} 
              loading={scanInProgress} 
            />
          </CyberCard>
        </div>

        <div className="space-y-6">
          <CyberCard title="Discovered Hosts">
            {discoveredHosts.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground mb-2">
                  {discoveredHosts.length} hosts discovered on network
                </div>
                <Tabs defaultValue="grid">
                  <TabsList className="mb-2">
                    <TabsTrigger value="grid">Grid</TabsTrigger>
                    <TabsTrigger value="detailed">Detailed</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="grid">
                    <div className="space-y-2">
                      {discoveredHosts.map((host, index) => (
                        <div 
                          key={index}
                          className="bg-muted p-3 rounded-md hover:bg-muted/80 cursor-pointer transition-colors"
                        >
                          <div className="flex justify-between mb-1">
                            <span className="font-bold text-cyber-blue">{host.ip}</span>
                            <StatusBadge status="open" />
                          </div>
                          <div className="text-sm text-muted-foreground">{host.hostname}</div>
                          <Separator className="my-2" />
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>MAC: {host.mac}</div>
                            <div>Latency: {host.latency}</div>
                            <div>Vendor: {host.vendor}</div>
                            {host.os && <div>OS: {host.os}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="detailed">
                    <div className="space-y-4">
                      {discoveredHosts.map((host, index) => (
                        <HostDetail key={index} host={host} />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {scanInProgress ? (
                  <div className="flex flex-col items-center">
                    <Loader className="h-8 w-8 animate-spin mb-2 text-cyber-blue" />
                    <p>Searching for hosts...</p>
                  </div>
                ) : (
                  <p>No hosts discovered yet. Run a scan to find devices.</p>
                )}
              </div>
            )}
          </CyberCard>

          <CyberCard title="Scan Statistics">
            {scanCompleted && discoveredHosts.length > 0 ? (
              <div className="space-y-3">
                <div className="font-medium mb-2">Host Summary</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Total Hosts:</div>
                  <div>{discoveredHosts.length}</div>
                  
                  <div>With Vulnerabilities:</div>
                  <div>{discoveredHosts.filter(h => h.vulns && h.vulns.length > 0).length}</div>
                  
                  <div>OS Types:</div>
                  <div>
                    {Array.from(new Set(discoveredHosts.map(h => h.os ? h.os.split(' ')[0] : 'Unknown'))).length}
                  </div>
                  
                  {scanOptions.serviceScan && (
                    <>
                      <div>Open Services:</div>
                      <div>
                        {discoveredHosts.reduce((sum, host) => sum + (host.services ? host.services.length : 0), 0)}
                      </div>
                    </>
                  )}
                </div>
                
                {scanOptions.serviceScan && (
                  <div className="mt-4">
                    <div className="font-medium mb-2">Common Services</div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>SSH (22)</span>
                        <span>{discoveredHosts.filter(h => h.services?.some((s: any) => s.port === 22)).length} hosts</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HTTP (80)</span>
                        <span>{discoveredHosts.filter(h => h.services?.some((s: any) => s.port === 80)).length} hosts</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HTTPS (443)</span>
                        <span>{discoveredHosts.filter(h => h.services?.some((s: any) => s.port === 443)).length} hosts</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No scan statistics available
              </div>
            )}
          </CyberCard>
        </div>
      </div>
    </MainLayout>
  );
};

interface HostDetailProps {
  host: {
    ip: string;
    mac: string;
    hostname: string;
    status: string;
    latency: string;
    vendor: string;
    os?: string;
    osDetails?: string;
    services?: {
      port: number;
      name: string;
      version: string;
      state: string;
      protocol?: string;
    }[];
    vulns?: {
      id: string;
      name: string;
      severity: string;
    }[];
  };
}

const HostDetail: React.FC<HostDetailProps> = ({ host }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-muted rounded-md overflow-hidden">
      <div 
        className="p-3 flex justify-between items-center cursor-pointer hover:bg-muted/80"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Network size={16} className="text-cyber-blue" />
          <span className="font-bold">{host.ip}</span>
          <span className="text-sm text-muted-foreground">({host.hostname})</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status="open" />
          {host.vulns && host.vulns.length > 0 && (
            <div className="text-xs bg-cyber-red/20 text-cyber-red px-2 py-0.5 rounded">
              {host.vulns.length} vuln
            </div>
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-3 pt-0 border-t border-muted/30">
          <div className="grid grid-cols-2 gap-3 text-sm mt-3">
            <div>
              <div className="font-medium text-cyber-blue mb-1">System Info</div>
              <div className="space-y-1 text-xs">
                <div><span className="text-muted-foreground">MAC:</span> {host.mac}</div>
                <div><span className="text-muted-foreground">Vendor:</span> {host.vendor}</div>
                <div><span className="text-muted-foreground">Latency:</span> {host.latency}</div>
                {host.os && <div><span className="text-muted-foreground">OS:</span> {host.os}</div>}
                {host.osDetails && <div><span className="text-muted-foreground">OS Details:</span> {host.osDetails}</div>}
              </div>
            </div>
            
            {host.services && host.services.length > 0 && (
              <div>
                <div className="font-medium text-cyber-blue mb-1">Services</div>
                <div className="space-y-1 text-xs max-h-32 overflow-y-auto">
                  {host.services.map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <span className="font-mono">{service.port}</span>/
                        <span className="text-muted-foreground">{service.protocol || 'tcp'}</span>
                      </div>
                      <div>{service.name} {service.version && `(${service.version})`}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {host.vulns && host.vulns.length > 0 && (
            <div className="mt-3">
              <div className="font-medium text-cyber-blue mb-1">Potential Vulnerabilities</div>
              <div className="space-y-1 text-xs">
                {host.vulns.map((vuln, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-muted/30 last:border-0">
                    <div className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${
                        vuln.severity === 'high' ? 'bg-cyber-red' : 
                        vuln.severity === 'medium' ? 'bg-cyber-yellow' : 'bg-cyber-blue'
                      }`}></span>
                      <span>{vuln.name}</span>
                    </div>
                    <div className="font-mono">{vuln.id}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NetworkScan;
