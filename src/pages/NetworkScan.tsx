
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CyberCard from '@/components/common/CyberCard';
import TerminalOutput from '@/components/common/TerminalOutput';
import StatusBadge from '@/components/common/StatusBadge';
import { Wifi, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

const NetworkScan: React.FC = () => {
  const { toast } = useToast();
  const [targetNetwork, setTargetNetwork] = useState('192.168.1.0/24');
  const [scanInProgress, setScanInProgress] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [discoveredHosts, setDiscoveredHosts] = useState<any[]>([]);

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
    setTerminalOutput([
      `Starting network scan on target: ${targetNetwork}`,
      `Initializing scan engine...`,
      `Sending ARP packets to discover live hosts...`
    ]);
    setDiscoveredHosts([]);

    // Simulate scan progress
    const timeoutIds: NodeJS.Timeout[] = [];
    
    const timeout1 = setTimeout(() => {
      setTerminalOutput(prev => [...prev, `Received responses, processing results...`]);
    }, 1500);
    
    const timeout2 = setTimeout(() => {
      setTerminalOutput(prev => [...prev, `Identified multiple live hosts on network ${targetNetwork}`]);
    }, 3000);
    
    const timeout3 = setTimeout(() => {
      setScanInProgress(false);
      setScanCompleted(true);
      setTerminalOutput(prev => [...prev, `Network scan completed. Found ${mockHosts.length} live hosts.`]);
      setDiscoveredHosts(mockHosts);
      
      toast({
        title: "Network Scan Complete",
        description: `Found ${mockHosts.length} hosts on ${targetNetwork}`,
      });
    }, 4500);
    
    timeoutIds.push(timeout1, timeout2, timeout3);
    
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  };

  // Mock data for demonstration
  const mockHosts = [
    { ip: '192.168.1.1', mac: '00:11:22:33:44:55', hostname: 'Gateway', status: 'up', latency: '2ms', vendor: 'Cisco' },
    { ip: '192.168.1.5', mac: '11:22:33:44:55:66', hostname: 'Desktop-PC', status: 'up', latency: '3ms', vendor: 'Dell' },
    { ip: '192.168.1.10', mac: '22:33:44:55:66:77', hostname: 'Laptop-Alice', status: 'up', latency: '5ms', vendor: 'Apple' },
    { ip: '192.168.1.15', mac: '33:44:55:66:77:88', hostname: 'Server01', status: 'up', latency: '1ms', vendor: 'HP' },
    { ip: '192.168.1.20', mac: '44:55:66:77:88:99', hostname: 'IoT-Device', status: 'up', latency: '8ms', vendor: 'TP-Link' },
  ];

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Wifi className="text-cyber-blue" />
          Network Scanner
        </h1>
        <p className="text-muted-foreground">
          Discover live hosts on a network using ARP and ICMP techniques
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
                      </div>
                    </div>
                  ))}
                </div>
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

          <CyberCard title="Scan Options">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" disabled={!scanCompleted}>
                Export Results
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!scanCompleted}>
                Save Scan
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Load Previous Scan
              </Button>
            </div>
          </CyberCard>
        </div>
      </div>
    </MainLayout>
  );
};

export default NetworkScan;
