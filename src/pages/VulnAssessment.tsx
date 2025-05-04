
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CyberCard from '@/components/common/CyberCard';
import TerminalOutput from '@/components/common/TerminalOutput';
import StatusBadge from '@/components/common/StatusBadge';
import { Bug, Loader, ShieldAlert, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const VulnAssessment: React.FC = () => {
  const { toast } = useToast();
  const [target, setTarget] = useState('https://example.com');
  const [scanInProgress, setScanInProgress] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);

  const startVulnScan = () => {
    if (!target) {
      toast({
        title: "Input Error",
        description: "Please enter a target to scan",
        variant: "destructive"
      });
      return;
    }

    setScanInProgress(true);
    setScanCompleted(false);
    setScanProgress(0);
    setTerminalOutput([
      `Starting vulnerability assessment on target: ${target}`,
      `Initializing scan modules...`,
      `Loading vulnerability database...`
    ]);
    setVulnerabilities([]);

    // Simulate scan progress
    const intervalId = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 5);
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 300);

    // Simulate scan steps
    const steps = [
      { time: 1500, message: `Fingerprinting target system...` },
      { time: 3000, message: `Checking for outdated software versions...` },
      { time: 4500, message: `Scanning for common web vulnerabilities...` },
      { time: 6000, message: `Testing for authentication weaknesses...` },
      { time: 7500, message: `Checking for misconfigured services...` },
      { time: 9000, message: `Running network security checks...` },
      { time: 10500, message: `Finalizing vulnerability assessment...` }
    ];

    const timeoutIds: NodeJS.Timeout[] = [];

    steps.forEach(step => {
      const timeoutId = setTimeout(() => {
        setTerminalOutput(prev => [...prev, step.message]);
      }, step.time);
      timeoutIds.push(timeoutId);
    });

    const finalTimeout = setTimeout(() => {
      clearInterval(intervalId);
      setScanProgress(100);
      setScanInProgress(false);
      setScanCompleted(true);
      setVulnerabilities(mockVulnerabilities);
      setTerminalOutput(prev => [
        ...prev,
        `Vulnerability assessment completed. Found ${mockVulnerabilities.length} potential issues.`
      ]);
      
      toast({
        title: "Vulnerability Assessment Complete",
        description: `Found ${mockVulnerabilities.filter(v => v.severity === 'high').length} high, ${mockVulnerabilities.filter(v => v.severity === 'medium').length} medium, and ${mockVulnerabilities.filter(v => v.severity === 'low').length} low severity issues.`,
      });
    }, 12000);
    
    timeoutIds.push(finalTimeout);
    
    return () => {
      clearInterval(intervalId);
      timeoutIds.forEach(id => clearTimeout(id));
    };
  };

  // Mock vulnerabilities data
  const mockVulnerabilities = [
    {
      id: 'CVE-2023-1234',
      name: 'SQL Injection Vulnerability',
      severity: 'high',
      category: 'Injection',
      description: 'SQL injection vulnerability in login form allows attackers to bypass authentication.',
      location: '/login.php',
      recommendation: 'Use parameterized queries or prepared statements.'
    },
    {
      id: 'CVE-2023-5678',
      name: 'Cross-Site Scripting (XSS)',
      severity: 'medium',
      category: 'XSS',
      description: 'Reflected XSS vulnerability in search functionality allows attackers to inject malicious scripts.',
      location: '/search?q=parameter',
      recommendation: 'Implement input validation and output encoding.'
    },
    {
      id: 'CVE-2023-9101',
      name: 'Insecure Direct Object References',
      severity: 'medium',
      category: 'Access Control',
      description: 'Direct object reference allows unauthorized access to user data by modifying request parameters.',
      location: '/profile?id=123',
      recommendation: 'Implement proper access controls and indirect reference maps.'
    },
    {
      id: 'CVE-2023-1122',
      name: 'SSL/TLS Misconfiguration',
      severity: 'medium',
      category: 'Cryptography',
      description: 'Server supports outdated TLS versions (TLSv1.0, TLSv1.1) that have known vulnerabilities.',
      location: 'Server configuration',
      recommendation: 'Disable TLSv1.0 and TLSv1.1, use only TLSv1.2+ with strong cipher suites.'
    },
    {
      id: 'CVE-2023-3344',
      name: 'Missing Security Headers',
      severity: 'low',
      category: 'Misconfiguration',
      description: 'Security headers like Content-Security-Policy and X-XSS-Protection are not set.',
      location: 'HTTP Response Headers',
      recommendation: 'Configure appropriate security headers in the web server or application.'
    }
  ];

  const getSeverityCount = (severity: string) => {
    return vulnerabilities.filter(vuln => vuln.severity === severity).length;
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Bug className="text-cyber-blue" />
          Vulnerability Assessment
        </h1>
        <p className="text-muted-foreground">
          Identify security weaknesses and potential vulnerabilities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CyberCard title="Vulnerability Scan Configuration">
            <div className="space-y-4">
              <div>
                <label htmlFor="target" className="block text-sm font-medium mb-1">
                  Target (URL, IP, or hostname)
                </label>
                <Input
                  id="target"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g. https://example.com or 192.168.1.1"
                  className="bg-muted"
                />
              </div>
              
              <Button
                onClick={startVulnScan}
                disabled={scanInProgress}
                className="bg-cyber-blue text-black hover:bg-cyber-blue/80"
              >
                {scanInProgress ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  'Start Vulnerability Scan'
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
          <CyberCard title="Vulnerability Summary">
            {scanCompleted ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-cyber-red/20 p-4 rounded-md">
                    <div className="text-2xl font-bold text-cyber-red">{getSeverityCount('high')}</div>
                    <div className="text-xs">High Severity</div>
                  </div>
                  <div className="bg-cyber-yellow/20 p-4 rounded-md">
                    <div className="text-2xl font-bold text-cyber-yellow">{getSeverityCount('medium')}</div>
                    <div className="text-xs">Medium Severity</div>
                  </div>
                  <div className="bg-cyber-blue/20 p-4 rounded-md">
                    <div className="text-2xl font-bold text-cyber-blue">{getSeverityCount('low')}</div>
                    <div className="text-xs">Low Severity</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Target Information</h3>
                  <div className="text-xs text-muted-foreground">
                    <div className="grid grid-cols-2 gap-2">
                      <span>Target:</span>
                      <span>{target}</span>
                      <span>Scan Start:</span>
                      <span>2025-05-04 14:30</span>
                      <span>Scan Duration:</span>
                      <span>12 seconds</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {scanInProgress ? (
                  <div className="flex flex-col items-center">
                    <Loader className="h-8 w-8 animate-spin mb-2 text-cyber-blue" />
                    <p>Analyzing target security...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ShieldAlert className="h-8 w-8 mb-2 text-cyber-blue" />
                    <p>Run a vulnerability scan to see results</p>
                  </div>
                )}
              </div>
            )}
          </CyberCard>

          <CyberCard title="Detected Vulnerabilities">
            {vulnerabilities.length > 0 ? (
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="high">High</TabsTrigger>
                  <TabsTrigger value="medium">Medium</TabsTrigger>
                  <TabsTrigger value="low">Low</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="max-h-[400px] overflow-auto">
                  <div className="mt-2 space-y-3">
                    {vulnerabilities.map((vuln, index) => (
                      <VulnerabilityItem key={index} vuln={vuln} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="high" className="max-h-[400px] overflow-auto">
                  <div className="mt-2 space-y-3">
                    {vulnerabilities
                      .filter(vuln => vuln.severity === 'high')
                      .map((vuln, index) => (
                        <VulnerabilityItem key={index} vuln={vuln} />
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="medium" className="max-h-[400px] overflow-auto">
                  <div className="mt-2 space-y-3">
                    {vulnerabilities
                      .filter(vuln => vuln.severity === 'medium')
                      .map((vuln, index) => (
                        <VulnerabilityItem key={index} vuln={vuln} />
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="low" className="max-h-[400px] overflow-auto">
                  <div className="mt-2 space-y-3">
                    {vulnerabilities
                      .filter(vuln => vuln.severity === 'low')
                      .map((vuln, index) => (
                        <VulnerabilityItem key={index} vuln={vuln} />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No vulnerabilities detected yet
              </div>
            )}
          </CyberCard>
        </div>
      </div>
    </MainLayout>
  );
};

interface VulnerabilityItemProps {
  vuln: {
    id: string;
    name: string;
    severity: string;
    category: string;
    description: string;
    location: string;
    recommendation: string;
  };
}

const VulnerabilityItem: React.FC<VulnerabilityItemProps> = ({ vuln }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-cyber-red';
      case 'medium':
        return 'text-cyber-yellow';
      case 'low':
        return 'text-cyber-blue';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div 
      className="bg-muted p-3 rounded-md hover:bg-muted/80 transition-colors cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-center mb-1">
        <div className="font-bold">{vuln.name}</div>
        <StatusBadge 
          status={vuln.severity === 'high' ? 'vulnerable' : vuln.severity === 'medium' ? 'unknown' : 'secure'} 
          className={getSeverityColor(vuln.severity)}
        />
      </div>
      <div className="text-xs flex justify-between">
        <span>{vuln.id}</span>
        <span>{vuln.category}</span>
      </div>
      
      {isExpanded && (
        <div className="mt-3 border-t border-muted pt-2 text-sm">
          <div className="mb-2">
            <div className="font-medium text-cyber-blue">Description</div>
            <div className="text-xs">{vuln.description}</div>
          </div>
          
          <div className="mb-2">
            <div className="font-medium text-cyber-blue">Location</div>
            <div className="text-xs">{vuln.location}</div>
          </div>
          
          <div>
            <div className="font-medium text-cyber-blue">Recommendation</div>
            <div className="text-xs">{vuln.recommendation}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VulnAssessment;
