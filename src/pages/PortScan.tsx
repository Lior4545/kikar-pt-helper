
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CyberCard from '@/components/common/CyberCard';
import TerminalOutput from '@/components/common/TerminalOutput';
import StatusBadge from '@/components/common/StatusBadge';
import { Database, Loader, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PortScan: React.FC = () => {
  const { toast } = useToast();
  const [targetHost, setTargetHost] = useState('192.168.1.1');
  const [portRange, setPortRange] = useState('1-1000');
  const [scanType, setScanType] = useState('tcp');
  const [scanInProgress, setScanInProgress] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [discoveredPorts, setDiscoveredPorts] = useState<any[]>([]);

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
    setTerminalOutput([
      `Starting ${scanType.toUpperCase()} port scan on target: ${targetHost}`,
      `Port range: ${portRange}`,
      `Initializing scan...`
    ]);
    setDiscoveredPorts([]);

    // Simulate scan progress
    const timeoutIds: NodeJS.Timeout[] = [];
    
    const timeout1 = setTimeout(() => {
      setTerminalOutput(prev => [...prev, `Sending ${scanType.toUpperCase()} packets to ${targetHost}...`]);
    }, 1500);
    
    const timeout2 = setTimeout(() => {
      setTerminalOutput(prev => [...prev, `Receiving responses, analyzing port states...`]);
    }, 3000);
    
    const timeout3 = setTimeout(() => {
      setScanInProgress(false);
      setScanCompleted(true);
      
      const mockDiscoveredPorts = getMockPorts(scanType);
      setDiscoveredPorts(mockDiscoveredPorts);
      
      setTerminalOutput(prev => [
        ...prev, 
        `Port scan completed. Found ${mockDiscoveredPorts.filter(p => p.status === 'open').length} open ports out of ${mockDiscoveredPorts.length} scanned.`
      ]);
      
      toast({
        title: "Port Scan Complete",
        description: `Found ${mockDiscoveredPorts.filter(p => p.status === 'open').length} open ports on ${targetHost}`,
      });
    }, 4500);
    
    timeoutIds.push(timeout1, timeout2, timeout3);
    
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  };

  // Mock data for demonstration
  const getMockPorts = (type: string) => {
    const commonPorts = [
      { port: 21, service: 'FTP', status: 'closed', version: '-', info: 'File Transfer Protocol' },
      { port: 22, service: 'SSH', status: 'open', version: 'OpenSSH 8.2p1', info: 'Secure Shell' },
      { port: 25, service: 'SMTP', status: 'filtered', version: '-', info: 'Simple Mail Transfer Protocol' },
      { port: 53, service: 'DNS', status: 'open', version: 'BIND 9.16.1', info: 'Domain Name System' },
      { port: 80, service: 'HTTP', status: 'open', version: 'nginx 1.18.0', info: 'Hypertext Transfer Protocol' },
      { port: 443, service: 'HTTPS', status: 'open', version: 'nginx 1.18.0', info: 'HTTP over TLS/SSL' },
      { port: 3306, service: 'MySQL', status: 'closed', version: '-', info: 'MySQL Database' },
      { port: 8080, service: 'HTTP-ALT', status: 'filtered', version: '-', info: 'Alternate HTTP Port' },
    ];
    
    // Randomize some results based on scan type
    return commonPorts.map(port => {
      // Randomize some ports status based on scan type
      if (Math.random() > 0.7) {
        const statuses = ['open', 'closed', 'filtered'];
        port.status = statuses[Math.floor(Math.random() * statuses.length)];
      }
      
      // Add some variation for UDP
      if (type === 'udp' && port.port === 53) {
        port.status = 'open';
      }
      
      return port;
    });
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Database className="text-cyber-blue" />
          Port Scanner
        </h1>
        <p className="text-muted-foreground">
          Identify open ports and services on target hosts
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
                  Port Range
                </label>
                <Input
                  id="portRange"
                  value={portRange}
                  onChange={(e) => setPortRange(e.target.value)}
                  placeholder="e.g. 1-1000 or 22,80,443"
                  className="bg-muted"
                />
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2">Scan Type</div>
                <RadioGroup defaultValue="tcp" value={scanType} onValueChange={setScanType} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tcp" id="tcp" />
                    <Label htmlFor="tcp">TCP</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="udp" id="udp" />
                    <Label htmlFor="udp">UDP</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="syn" id="syn" />
                    <Label htmlFor="syn">SYN</Label>
                  </div>
                </RadioGroup>
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
                      <PortItem key={index} port={port} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="open">
                  <div className="mt-4 space-y-2">
                    {discoveredPorts
                      .filter(port => port.status === 'open')
                      .map((port, index) => (
                        <PortItem key={index} port={port} />
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="closed">
                  <div className="mt-4 space-y-2">
                    {discoveredPorts
                      .filter(port => port.status !== 'open')
                      .map((port, index) => (
                        <PortItem key={index} port={port} />
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
  };
}

const PortItem: React.FC<PortItemProps> = ({ port }) => {
  return (
    <div className="bg-muted p-3 rounded-md hover:bg-muted/80 transition-colors">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <Server size={14} className="text-cyber-blue" />
          <span className="font-bold">{port.port} - {port.service}</span>
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
    </div>
  );
};

export default PortScan;
