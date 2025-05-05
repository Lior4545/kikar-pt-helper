
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CyberCard from '@/components/common/CyberCard';
import TerminalOutput from '@/components/common/TerminalOutput';
import StatusBadge from '@/components/common/StatusBadge';
import { Database, Loader, Server, AlertTriangle, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const PortScan: React.FC = () => {
  const { toast } = useToast();
  const [targetHost, setTargetHost] = useState('192.168.1.1');
  const [portRange, setPortRange] = useState('1-1000');
  const [scanType, setScanType] = useState('tcp');
  const [scanInProgress, setScanInProgress] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [discoveredPorts, setDiscoveredPorts] = useState<any[]>([]);
  
  // Advanced scan options
  const [advancedOptions, setAdvancedOptions] = useState({
    serviceScan: true,       // Version detection (-sV)
    osDetection: false,      // OS detection (-O)
    scriptScan: false,       // Default scripts (-sC)
    vulnerabilityScan: false,// Vuln scripts (--script vuln)
    intenseScan: false,      // More thorough (-T4)
    allPorts: false,         // Scan all 65535 ports (-p-)
    timing: "normal",        // T0-T5
    fragmentation: false,    // Split packets (-f)
    decoy: false,            // Use decoy IPs (-D)
  });

  const handleOptionChange = (option: string) => {
    setAdvancedOptions(prev => ({
      ...prev,
      [option]: !prev[option as keyof typeof prev]
    }));
  };

  const handleSelectChange = (option: string, value: string) => {
    setAdvancedOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const startPortScan = () => {
    if (!targetHost || !portRange) {
      toast({
        title: "Input Error",
        description: "Please enter a target host and port range",
        variant: "destructive"
      });
      return;
    }

    setScanInProgress(true);
    setScanCompleted(false);
    setScanProgress(0);
    
    // Create nmap command based on options
    let nmapCommand = 'nmap';
    
    // Add scan type
    if (scanType === 'tcp') nmapCommand += ' -sT';
    else if (scanType === 'syn') nmapCommand += ' -sS';
    else if (scanType === 'udp') nmapCommand += ' -sU';
    
    // Add port range
    if (advancedOptions.allPorts) {
      nmapCommand += ' -p-';
    } else {
      nmapCommand += ` -p ${portRange}`;
    }
    
    // Add advanced options
    if (advancedOptions.serviceScan) nmapCommand += ' -sV';
    if (advancedOptions.osDetection) nmapCommand += ' -O';
    if (advancedOptions.scriptScan) nmapCommand += ' -sC';
    if (advancedOptions.vulnerabilityScan) nmapCommand += ' --script vuln';
    if (advancedOptions.fragmentation) nmapCommand += ' -f';
    if (advancedOptions.decoy) nmapCommand += ' -D RND:5';
    
    // Add timing
    nmapCommand += ` -T${
      advancedOptions.timing === 'paranoid' ? '0' :
      advancedOptions.timing === 'sneaky' ? '1' :
      advancedOptions.timing === 'polite' ? '2' :
      advancedOptions.timing === 'normal' ? '3' :
      advancedOptions.timing === 'aggressive' ? '4' : '5'
    }`;
    
    // Add target
    nmapCommand += ` ${targetHost}`;
    
    setTerminalOutput([
      `Starting ${scanType.toUpperCase()} port scan on target: ${targetHost}`,
      `Command: ${nmapCommand}`,
      `Port range: ${advancedOptions.allPorts ? '1-65535' : portRange}`,
      `Initializing scan...`
    ]);
    setDiscoveredPorts([]);

    // Simulate scan progress
    const intervalId = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 3);
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);
    
    // Determine scan duration based on options (simulate more thorough scans taking longer)
    const baseTimeout = 4000;
    const optionCount = Object.values(advancedOptions).filter(v => v === true).length;
    let scanDuration = baseTimeout + (optionCount * 800);
    
    // More ports = longer scan
    if (advancedOptions.allPorts) {
      scanDuration += 3000;
    } else {
      const portCount = calculatePortCount(portRange);
      scanDuration += Math.min(portCount / 20, 3000);
    }
    
    // Specific scan types take longer
    if (scanType === 'udp') scanDuration += 2000;
    if (advancedOptions.vulnerabilityScan) scanDuration += 3000;
    
    // Add timing factor
    scanDuration += (
      advancedOptions.timing === 'insane' ? 0 :
      advancedOptions.timing === 'aggressive' ? 500 :
      advancedOptions.timing === 'normal' ? 1000 :
      advancedOptions.timing === 'polite' ? 2000 :
      advancedOptions.timing === 'sneaky' ? 3000 : 4000
    );

    // Add status updates throughout the scan
    const progressMessages = [
      { time: scanDuration * 0.1, message: `Sending ${scanType.toUpperCase()} packets to ${targetHost}...` },
      { time: scanDuration * 0.3, message: `Waiting for responses...` },
      { time: scanDuration * 0.5, message: `Receiving responses, analyzing port states...` },
      { time: scanDuration * 0.7, message: `Identifying ${advancedOptions.serviceScan ? 'services and versions' : 'open ports'}...` },
      { time: scanDuration * 0.8, message: `Finalizing results...` }
    ];
    
    const timeoutIds: NodeJS.Timeout[] = [];
    
    progressMessages.forEach(({ time, message }) => {
      const timeoutId = setTimeout(() => {
        setTerminalOutput(prev => [...prev, message]);
      }, time);
      timeoutIds.push(timeoutId);
    });
    
    const finalTimeout = setTimeout(() => {
      clearInterval(intervalId);
      setScanProgress(100);
      setScanInProgress(false);
      setScanCompleted(true);
      
      const mockDiscoveredPorts = getMockPorts(scanType, advancedOptions);
      setDiscoveredPorts(mockDiscoveredPorts);
      
      setTerminalOutput(prev => [
        ...prev, 
        `Port scan completed. Found ${mockDiscoveredPorts.filter(p => p.status === 'open').length} open ports out of ${mockDiscoveredPorts.length} scanned.`,
        `Scan completed in ${(scanDuration / 1000).toFixed(1)} seconds.`
      ]);
      
      toast({
        title: "Port Scan Complete",
        description: `Found ${mockDiscoveredPorts.filter(p => p.status === 'open').length} open ports on ${targetHost}`,
      });
    }, scanDuration);
    
    timeoutIds.push(finalTimeout);
    
    return () => {
      clearInterval(intervalId);
      timeoutIds.forEach(id => clearTimeout(id));
    };
  };

  // Calculate the number of ports in a range (for simulating scan time)
  const calculatePortCount = (range: string) => {
    try {
      if (range.includes('-')) {
        const [start, end] = range.split('-').map(Number);
        return end - start + 1;
      } else if (range.includes(',')) {
        return range.split(',').length;
      } else {
        return 1;
      }
    } catch (error) {
      return 100; // default
    }
  };

  // Generate mock data for demonstration
  const getMockPorts = (type: string, options: typeof advancedOptions) => {
    const tcpPorts = [
      { 
        port: 21, 
        service: 'FTP', 
        status: 'closed', 
        version: '-', 
        info: 'File Transfer Protocol',
        protocol: 'tcp',
        vulns: []
      },
      { 
        port: 22, 
        service: 'SSH', 
        status: 'open', 
        version: 'OpenSSH 8.2p1', 
        info: 'Secure Shell',
        protocol: 'tcp',
        vulns: [
          { id: 'CVE-2020-14145', name: 'OpenSSH through 8.3p1 allows attackers to guess the user list', severity: 'medium' }
        ]
      },
      { 
        port: 25, 
        service: 'SMTP', 
        status: 'filtered', 
        version: '-', 
        info: 'Simple Mail Transfer Protocol',
        protocol: 'tcp',
        vulns: []
      },
      { 
        port: 53, 
        service: 'DNS', 
        status: 'open', 
        version: 'BIND 9.16.1', 
        info: 'Domain Name System',
        protocol: 'tcp',
        vulns: []
      },
      { 
        port: 80, 
        service: 'HTTP', 
        status: 'open', 
        version: 'nginx 1.18.0', 
        info: 'Hypertext Transfer Protocol',
        protocol: 'tcp',
        vulns: [
          { id: 'CVE-2022-41741', name: 'Nginx 1.18.0 directory traversal vulnerability', severity: 'high' }
        ]
      },
      { 
        port: 443, 
        service: 'HTTPS', 
        status: 'open', 
        version: 'nginx 1.18.0', 
        info: 'HTTP over TLS/SSL',
        protocol: 'tcp',
        vulns: [
          { id: 'CVE-2022-41741', name: 'Nginx 1.18.0 directory traversal vulnerability', severity: 'high' },
          { id: 'CVE-2021-44790', name: 'TLS 1.0/1.1 deprecated protocol vulnerability', severity: 'medium' }
        ]
      },
      { 
        port: 445, 
        service: 'SMB', 
        status: 'open', 
        version: 'Samba 4.11.6', 
        info: 'Server Message Block',
        protocol: 'tcp',
        vulns: [
          { id: 'CVE-2021-44142', name: 'Samba vfs_fruit heap-based buffer overflow', severity: 'high' }
        ]
      },
      { 
        port: 3306, 
        service: 'MySQL', 
        status: 'closed', 
        version: '-', 
        info: 'MySQL Database',
        protocol: 'tcp',
        vulns: []
      },
      { 
        port: 8080, 
        service: 'HTTP-ALT', 
        status: 'filtered', 
        version: '-', 
        info: 'Alternate HTTP Port',
        protocol: 'tcp',
        vulns: []
      },
    ];
    
    const udpPorts = [
      { 
        port: 53, 
        service: 'DNS', 
        status: 'open', 
        version: 'BIND 9.16.1', 
        info: 'Domain Name System',
        protocol: 'udp',
        vulns: []
      },
      { 
        port: 67, 
        service: 'DHCP', 
        status: 'open', 
        version: 'ISC DHCP 4.4.1', 
        info: 'Dynamic Host Configuration Protocol',
        protocol: 'udp',
        vulns: []
      },
      { 
        port: 123, 
        service: 'NTP', 
        status: 'open', 
        version: 'NTP v4.2.8p12', 
        info: 'Network Time Protocol',
        protocol: 'udp',
        vulns: []
      },
      { 
        port: 161, 
        service: 'SNMP', 
        status: 'open', 
        version: 'Net-SNMP 5.8', 
        info: 'Simple Network Management Protocol',
        protocol: 'udp',
        vulns: [
          { id: 'CVE-2020-15861', name: 'Net-SNMP through 5.8 has a double free in usm_free_usmStateReference', severity: 'high' }
        ]
      },
      { 
        port: 500, 
        service: 'ISAKMP', 
        status: 'filtered', 
        version: '-', 
        info: 'Internet Security Association and Key Management Protocol',
        protocol: 'udp',
        vulns: []
      },
    ];
    
    // Choose ports based on scan type
    let portsToUse = type === 'udp' ? udpPorts : tcpPorts;
    
    // For SYN scans, we might have slightly different results
    if (type === 'syn') {
      portsToUse = tcpPorts.map(port => {
        // SYN scans might detect some filtered ports as closed
        if (port.status === 'filtered' && Math.random() > 0.6) {
          return { ...port, status: 'closed' };
        }
        return port;
      });
    }
    
    // Randomize some results
    portsToUse = portsToUse.map(port => {
      // Randomize version information if version detection is off
      if (!options.serviceScan) {
        return { ...port, version: '-' };
      }
      return port;
    });
    
    // For all ports scan, add more random ports
    if (options.allPorts) {
      const extraPorts = [
        { port: 1433, service: 'MSSQL', status: 'closed', version: '-', info: 'Microsoft SQL Server', protocol: type === 'udp' ? 'udp' : 'tcp', vulns: [] },
        { port: 5432, service: 'PostgreSQL', status: 'closed', version: '-', info: 'PostgreSQL Database', protocol: type === 'udp' ? 'udp' : 'tcp', vulns: [] },
        { port: 6379, service: 'Redis', status: 'open', version: 'Redis 6.0.9', info: 'Redis Key-Value Store', protocol: type === 'udp' ? 'udp' : 'tcp', vulns: [] },
        { port: 8443, service: 'HTTPS-ALT', status: 'open', version: 'Apache Tomcat', info: 'Alternate HTTPS', protocol: type === 'udp' ? 'udp' : 'tcp', vulns: [] },
        { port: 9000, service: 'Portainer', status: 'open', version: 'Portainer 2.9.3', info: 'Docker Management UI', protocol: type === 'udp' ? 'udp' : 'tcp', vulns: [] },
        { port: 27017, service: 'MongoDB', status: 'filtered', version: '-', info: 'MongoDB Database', protocol: type === 'udp' ? 'udp' : 'tcp', vulns: [] },
      ];
      
      portsToUse = [...portsToUse, ...extraPorts];
    }
    
    // Add vulnerability info if vulnerability scanning is enabled
    if (options.vulnerabilityScan) {
      portsToUse = portsToUse.map(port => {
        if (port.status === 'open' && port.version !== '-') {
          // Some common vulnerabilities for open services
          if (port.service === 'HTTP' || port.service === 'HTTPS') {
            if (!port.vulns.some(v => v.id === 'CVE-2022-31159')) {
              port.vulns.push({ id: 'CVE-2022-31159', name: 'Web Server Directory Listing Vulnerability', severity: 'medium' });
            }
          } else if (port.service === 'SSH' && port.version.includes('7.')) {
            if (!port.vulns.some(v => v.id === 'CVE-2018-15473')) {
              port.vulns.push({ id: 'CVE-2018-15473', name: 'OpenSSH Username Enumeration', severity: 'medium' });
            }
          } else if (port.service === 'SMB' && port.version.includes('4.')) {
            if (!port.vulns.some(v => v.id === 'CVE-2021-44142')) {
              port.vulns.push({ id: 'CVE-2021-44142', name: 'Samba vfs_fruit heap-based buffer overflow', severity: 'high' });
            }
          }
        }
        return port;
      });
    } else {
      // Remove vulnerability info if not scanning for vulns
      portsToUse = portsToUse.map(port => ({ ...port, vulns: [] }));
    }
    
    // Randomly pick ports and shuffle for variety (unless all ports)
    if (!options.allPorts) {
      portsToUse = portsToUse.sort(() => Math.random() - 0.5).slice(0, 4 + Math.floor(Math.random() * 4));
    }
    
    // Sort by port number
    return portsToUse.sort((a, b) => a.port - b.port);
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Database className="text-cyber-blue" />
          Advanced Port Scanner
        </h1>
        <p className="text-muted-foreground">
          Identify open ports, services, and potential vulnerabilities on target hosts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CyberCard title="Port Scan Configuration">
            <div className="space-y-4">
              <div>
                <label htmlFor="target" className="block text-sm font-medium mb-1">
                  Target Host (IP or hostname)
                </label>
                <Input
                  id="target"
                  value={targetHost}
                  onChange={(e) => setTargetHost(e.target.value)}
                  placeholder="e.g. 192.168.1.1"
                  className="bg-muted"
                />
              </div>
              
              <div>
                <label htmlFor="portRange" className="block text-sm font-medium mb-1">
                  Port Range {advancedOptions.allPorts && '(ignored when "All Ports" is selected)'}
                </label>
                <Input
                  id="portRange"
                  value={portRange}
                  onChange={(e) => setPortRange(e.target.value)}
                  placeholder="e.g. 1-1000 or 22,80,443"
                  className="bg-muted"
                  disabled={advancedOptions.allPorts}
                />
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2">Scan Type</div>
                <RadioGroup defaultValue="tcp" value={scanType} onValueChange={setScanType} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tcp" id="tcp" />
                    <Label htmlFor="tcp">TCP Connect</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="syn" id="syn" />
                    <Label htmlFor="syn">TCP SYN</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="udp" id="udp" />
                    <Label htmlFor="udp">UDP</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator className="my-2" />
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Advanced Options</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="serviceScan" 
                      checked={advancedOptions.serviceScan}
                      onCheckedChange={() => handleOptionChange('serviceScan')}
                    />
                    <Label htmlFor="serviceScan" className="text-sm">Service Version Detection</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="osDetection" 
                      checked={advancedOptions.osDetection}
                      onCheckedChange={() => handleOptionChange('osDetection')}
                    />
                    <Label htmlFor="osDetection" className="text-sm">OS Detection</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="scriptScan" 
                      checked={advancedOptions.scriptScan}
                      onCheckedChange={() => handleOptionChange('scriptScan')}
                    />
                    <Label htmlFor="scriptScan" className="text-sm">Run Default Scripts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="vulnerabilityScan" 
                      checked={advancedOptions.vulnerabilityScan}
                      onCheckedChange={() => handleOptionChange('vulnerabilityScan')}
                    />
                    <Label htmlFor="vulnerabilityScan" className="text-sm">Scan for Vulnerabilities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="allPorts" 
                      checked={advancedOptions.allPorts}
                      onCheckedChange={() => handleOptionChange('allPorts')}
                    />
                    <Label htmlFor="allPorts" className="text-sm">Scan All Ports (1-65535)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fragmentation" 
                      checked={advancedOptions.fragmentation}
                      onCheckedChange={() => handleOptionChange('fragmentation')}
                    />
                    <Label htmlFor="fragmentation" className="text-sm">Use Packet Fragmentation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="decoy" 
                      checked={advancedOptions.decoy}
                      onCheckedChange={() => handleOptionChange('decoy')}
                    />
                    <Label htmlFor="decoy" className="text-sm">Use Decoy IPs (Stealth)</Label>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="timing" className="block text-sm font-medium mb-1">
                    Timing Template
                  </label>
                  <select
                    id="timing"
                    value={advancedOptions.timing}
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
              
              <Button
                onClick={startPortScan}
                disabled={scanInProgress}
                className="bg-cyber-blue text-black hover:bg-cyber-blue/80"
              >
                {scanInProgress ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  'Start Port Scan'
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
          <CyberCard title="Discovered Ports">
            {discoveredPorts.length > 0 ? (
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="open">Open</TabsTrigger>
                  <TabsTrigger value="closed">Closed/Filtered</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <div className="mt-4 space-y-2">
                    {discoveredPorts.map((port, index) => (
                      <PortItem 
                        key={index} 
                        port={port} 
                        showVulnerabilities={advancedOptions.vulnerabilityScan}
                      />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="open">
                  <div className="mt-4 space-y-2">
                    {discoveredPorts
                      .filter(port => port.status === 'open')
                      .map((port, index) => (
                        <PortItem 
                          key={index} 
                          port={port} 
                          showVulnerabilities={advancedOptions.vulnerabilityScan}
                        />
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="closed">
                  <div className="mt-4 space-y-2">
                    {discoveredPorts
                      .filter(port => port.status !== 'open')
                      .map((port, index) => (
                        <PortItem 
                          key={index} 
                          port={port}
                          showVulnerabilities={advancedOptions.vulnerabilityScan}
                        />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {scanInProgress ? (
                  <div className="flex flex-col items-center">
                    <Loader className="h-8 w-8 animate-spin mb-2 text-cyber-blue" />
                    <p>Scanning ports...</p>
                  </div>
                ) : (
                  <p>No ports discovered yet. Run a scan to find open ports.</p>
                )}
              </div>
            )}
          </CyberCard>

          {advancedOptions.vulnerabilityScan && scanCompleted && discoveredPorts.some(p => p.vulns && p.vulns.length > 0) && (
            <CyberCard title="Vulnerability Summary">
              <div className="space-y-3">
                {discoveredPorts
                  .filter(port => port.vulns && port.vulns.length > 0)
                  .flatMap(port => 
                    port.vulns.map((vuln: any) => ({
                      ...vuln,
                      port: port.port,
                      service: port.service
                    }))
                  )
                  .map((vuln: any, idx: number) => (
                    <div key={idx} className="bg-muted/70 p-2 rounded flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {vuln.severity === 'high' ? (
                          <AlertTriangle size={14} className="text-cyber-red" />
                        ) : (
                          <FileWarning size={14} className="text-cyber-yellow" />
                        )}
                        <div>
                          <div className="text-xs">{vuln.port}/{vuln.service}</div>
                          <div className="text-sm">{vuln.name}</div>
                        </div>
                      </div>
                      <div className="text-xs font-mono">{vuln.id}</div>
                    </div>
                  ))
                }
              </div>
            </CyberCard>
          )}

          <CyberCard title="Common Services">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>SSH (22)</span>
                <span>Secure Shell</span>
              </div>
              <div className="flex justify-between">
                <span>HTTP (80)</span>
                <span>Web Server</span>
              </div>
              <div className="flex justify-between">
                <span>HTTPS (443)</span>
                <span>Secure Web</span>
              </div>
              <div className="flex justify-between">
                <span>FTP (21)</span>
                <span>File Transfer</span>
              </div>
              <div className="flex justify-between">
                <span>DNS (53)</span>
                <span>Domain Names</span>
              </div>
              <div className="flex justify-between">
                <span>SMB (445)</span>
                <span>File Sharing</span>
              </div>
            </div>
          </CyberCard>
        </div>
      </div>
    </MainLayout>
  );
};

interface PortItemProps {
  port: {
    port: number;
    service: string;
    status: 'open' | 'closed' | 'filtered';
    version: string;
    info: string;
    protocol?: string;
    vulns?: {
      id: string;
      name: string;
      severity: string;
    }[];
  };
  showVulnerabilities?: boolean;
}

const PortItem: React.FC<PortItemProps> = ({ port, showVulnerabilities = false }) => {
  const [expanded, setExpanded] = useState(false);
  const hasVulns = port.vulns && port.vulns.length > 0;
  
  return (
    <div 
      className={`bg-muted p-3 rounded-md hover:bg-muted/80 transition-colors ${hasVulns ? 'border-l-2 border-cyber-red' : ''}`}
      onClick={() => setExpanded(!expanded)}
      style={{ cursor: (hasVulns || port.version !== '-') ? 'pointer' : 'default' }}
    >
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <Server size={14} className="text-cyber-blue" />
          <span className="font-bold">
            {port.port}{port.protocol ? `/${port.protocol}` : ''} - {port.service}
          </span>
          {hasVulns && showVulnerabilities && (
            <span className="text-xs bg-cyber-red/20 text-cyber-red px-1 py-0.5 rounded-sm">
              {port.vulns?.length} vuln
            </span>
          )}
        </div>
        <StatusBadge status={port.status} />
      </div>
      <div className="text-xs">
        {port.version !== '-' ? (
          <span className="text-cyber-blue">{port.version}</span>
        ) : (
          <span className="text-muted-foreground">Version unknown</span>
        )}
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        {port.info}
      </div>
      
      {expanded && hasVulns && showVulnerabilities && (
        <div className="mt-3 border-t border-muted-foreground/20 pt-2">
          <div className="text-xs font-medium mb-1">Potential Vulnerabilities:</div>
          <div className="space-y-1">
            {port.vulns?.map((vuln, idx) => (
              <div key={idx} className="text-xs flex items-start gap-1">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${vuln.severity === 'high' ? 'bg-cyber-red' : 'bg-cyber-yellow'}`}></div>
                <div>
                  <span className="text-cyber-blue">{vuln.id}</span>: {vuln.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortScan;
