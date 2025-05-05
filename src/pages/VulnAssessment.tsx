
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CyberCard from '@/components/common/CyberCard';
import TerminalOutput from '@/components/common/TerminalOutput';
import StatusBadge from '@/components/common/StatusBadge';
import { Bug, Loader, ShieldAlert, Zap, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const VulnAssessment: React.FC = () => {
  const { toast } = useToast();
  const [target, setTarget] = useState('https://example.com');
  const [scanInProgress, setScanInProgress] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);
  
  // OWASP Top 10 scan options
  const [scanOptions, setScanOptions] = useState({
    a01_broken_access: true,
    a02_crypto_failures: true,
    a03_injection: true,
    a04_insecure_design: true,
    a05_security_misconfig: true,
    a06_vulnerable_components: true,
    a07_auth_failures: true,
    a08_software_integrity: true,
    a09_logging_failures: true,
    a10_ssrf: true,
    aggressive: false,
    deep_scan: false
  });

  const handleOptionChange = (option: string) => {
    setScanOptions(prev => ({
      ...prev,
      [option]: !prev[option as keyof typeof prev]
    }));
  };

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
      `Starting comprehensive vulnerability assessment on target: ${target}`,
      `Scan type: OWASP Top 10 ${scanOptions.aggressive ? '(Aggressive)' : '(Standard)'}`,
      `Depth: ${scanOptions.deep_scan ? 'Deep Scan' : 'Standard Scan'}`,
      `Initializing scan modules...`,
      `Loading vulnerability database...`
    ]);
    setVulnerabilities([]);

    // Simulate scan progress
    const intervalId = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 3);
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 300);

    // Count enabled scan options
    const enabledOptions = Object.values(scanOptions).filter(Boolean).length;

    // Simulate scan steps for each OWASP category
    const stepMessages = [
      { option: 'a01_broken_access', msg: 'Testing for broken access control (A01:2021)...' },
      { option: 'a02_crypto_failures', msg: 'Checking for cryptographic failures (A02:2021)...' },
      { option: 'a03_injection', msg: 'Scanning for injection vulnerabilities (A03:2021)...' },
      { option: 'a04_insecure_design', msg: 'Analyzing for insecure design (A04:2021)...' },
      { option: 'a05_security_misconfig', msg: 'Identifying security misconfigurations (A05:2021)...' },
      { option: 'a06_vulnerable_components', msg: 'Detecting vulnerable and outdated components (A06:2021)...' },
      { option: 'a07_auth_failures', msg: 'Testing for identification and authentication failures (A07:2021)...' },
      { option: 'a08_software_integrity', msg: 'Checking software and data integrity failures (A08:2021)...' },
      { option: 'a09_logging_failures', msg: 'Verifying logging and monitoring failures (A09:2021)...' },
      { option: 'a10_ssrf', msg: 'Testing for server-side request forgery (A10:2021)...' },
    ];

    const additionalMessages = [
      'Running version fingerprinting...',
      'Scanning exposed API endpoints...',
      'Testing for default credentials...',
      'Checking for information disclosure...',
      'Analyzing SSL/TLS configuration...',
      'Testing for CORS misconfigurations...',
      'Checking for sensitive data exposure...',
      'Scanning for unpatched vulnerabilities...',
      'Verifying HTTP security headers...',
      'Testing for business logic vulnerabilities...'
    ];

    const timeoutIds: NodeJS.Timeout[] = [];
    let timeOffset = 1500;
    const timeStep = scanOptions.deep_scan ? 1200 : 800;

    // Add OWASP category messages if they're enabled
    stepMessages.forEach(step => {
      if (scanOptions[step.option as keyof typeof scanOptions]) {
        const timeoutId = setTimeout(() => {
          setTerminalOutput(prev => [...prev, step.msg]);
        }, timeOffset);
        timeoutIds.push(timeoutId);
        timeOffset += timeStep;
      }
    });

    // Add additional messages based on scan depth
    if (scanOptions.deep_scan) {
      additionalMessages.forEach(msg => {
        const timeoutId = setTimeout(() => {
          setTerminalOutput(prev => [...prev, msg]);
        }, timeOffset);
        timeoutIds.push(timeoutId);
        timeOffset += timeStep;
      });
    }

    // Add some findings messages
    const findingMessages = [
      'Found potential SQL injection point...',
      'Detected outdated library with known CVEs...',
      'Identified missing security headers...',
      'Found sensitive information in HTTP responses...',
      'Detected XML external entity vulnerability...'
    ];

    if (scanOptions.aggressive) {
      const vulnerabilityTimeoutId = setTimeout(() => {
        setTerminalOutput(prev => [...prev, '--- Vulnerabilities detected ---']);
        findingMessages.forEach((msg, idx) => {
          const msgTimeoutId = setTimeout(() => {
            setTerminalOutput(prev => [...prev, msg]);
          }, 300 * idx);
          timeoutIds.push(msgTimeoutId);
        });
      }, timeOffset + 1000);
      timeoutIds.push(vulnerabilityTimeoutId);
    }

    const finalTimeout = setTimeout(() => {
      clearInterval(intervalId);
      setScanProgress(100);
      setScanInProgress(false);
      setScanCompleted(true);
      
      // Generate mock vulnerabilities with advanced details
      const mockVulns = generateMockVulnerabilities(scanOptions);
      setVulnerabilities(mockVulns);
      
      setTerminalOutput(prev => [
        ...prev,
        `Vulnerability assessment completed. Found ${mockVulns.length} potential issues.`,
        `High severity: ${mockVulns.filter(v => v.severity === 'high').length}`,
        `Medium severity: ${mockVulns.filter(v => v.severity === 'medium').length}`,
        `Low severity: ${mockVulns.filter(v => v.severity === 'low').length}`
      ]);
      
      toast({
        title: "Vulnerability Assessment Complete",
        description: `Found ${mockVulns.filter(v => v.severity === 'high').length} high, ${mockVulns.filter(v => v.severity === 'medium').length} medium, and ${mockVulns.filter(v => v.severity === 'low').length} low severity issues.`,
      });
    }, timeOffset + 3000);
    
    timeoutIds.push(finalTimeout);
    
    return () => {
      clearInterval(intervalId);
      timeoutIds.forEach(id => clearTimeout(id));
    };
  };

  // Generate mock vulnerabilities based on scan options
  const generateMockVulnerabilities = (options: typeof scanOptions) => {
    const baseVulnerabilities = [
      {
        id: 'CVE-2023-1234',
        name: 'SQL Injection Vulnerability',
        severity: 'high',
        category: 'Injection',
        owaspCategory: 'A03:2021-Injection',
        description: 'SQL injection vulnerability in login form allows attackers to bypass authentication.',
        location: '/login.php',
        recommendation: 'Use parameterized queries or prepared statements.',
        exploitability: 'Easy',
        references: ['https://owasp.org/Top10/A03_2021-Injection/'],
        affectedComponents: ['Authentication Module', 'Database Layer']
      },
      {
        id: 'CVE-2023-5678',
        name: 'Cross-Site Scripting (XSS)',
        severity: 'medium',
        category: 'XSS',
        owaspCategory: 'A03:2021-Injection',
        description: 'Reflected XSS vulnerability in search functionality allows attackers to inject malicious scripts.',
        location: '/search?q=parameter',
        recommendation: 'Implement input validation and output encoding.',
        exploitability: 'Medium',
        references: ['https://owasp.org/Top10/A03_2021-Injection/'],
        affectedComponents: ['Search Module', 'Frontend Templates']
      },
      {
        id: 'CVE-2023-9101',
        name: 'Insecure Direct Object References',
        severity: 'medium',
        category: 'Access Control',
        owaspCategory: 'A01:2021-Broken Access Control',
        description: 'Direct object reference allows unauthorized access to user data by modifying request parameters.',
        location: '/profile?id=123',
        recommendation: 'Implement proper access controls and indirect reference maps.',
        exploitability: 'Medium',
        references: ['https://owasp.org/Top10/A01_2021-Broken_Access_Control/'],
        affectedComponents: ['User Profile API', 'Access Control Module']
      },
      {
        id: 'CVE-2023-1122',
        name: 'SSL/TLS Misconfiguration',
        severity: 'medium',
        category: 'Cryptography',
        owaspCategory: 'A02:2021-Cryptographic Failures',
        description: 'Server supports outdated TLS versions (TLSv1.0, TLSv1.1) that have known vulnerabilities.',
        location: 'Server configuration',
        recommendation: 'Disable TLSv1.0 and TLSv1.1, use only TLSv1.2+ with strong cipher suites.',
        exploitability: 'Medium',
        references: ['https://owasp.org/Top10/A02_2021-Cryptographic_Failures/'],
        affectedComponents: ['Web Server Configuration', 'SSL Settings']
      },
      {
        id: 'CVE-2023-3344',
        name: 'Missing Security Headers',
        severity: 'low',
        category: 'Misconfiguration',
        owaspCategory: 'A05:2021-Security Misconfiguration',
        description: 'Security headers like Content-Security-Policy and X-XSS-Protection are not set.',
        location: 'HTTP Response Headers',
        recommendation: 'Configure appropriate security headers in the web server or application.',
        exploitability: 'Low',
        references: ['https://owasp.org/Top10/A05_2021-Security_Misconfiguration/'],
        affectedComponents: ['Web Server Configuration', 'Application Framework']
      },
      {
        id: 'CVE-2023-7890',
        name: 'Outdated Apache Struts Component',
        severity: 'high',
        category: 'Vulnerable Components',
        owaspCategory: 'A06:2021-Vulnerable and Outdated Components',
        description: 'The application uses Apache Struts 2.5.25 which is vulnerable to remote code execution (CVE-2023-XXXX).',
        location: 'Web Application Framework',
        recommendation: 'Update to the latest version of Apache Struts immediately.',
        exploitability: 'High',
        references: [
          'https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/',
          'https://nvd.nist.gov/vuln/detail/CVE-2023-XXXX'
        ],
        affectedComponents: ['Apache Struts 2.5.25', 'Web Application Framework']
      },
      {
        id: 'CVE-2023-4567',
        name: 'Server-Side Request Forgery (SSRF)',
        severity: 'high',
        category: 'SSRF',
        owaspCategory: 'A10:2021-Server-Side Request Forgery',
        description: 'SSRF vulnerability in the image import functionality allows attackers to make requests to internal services.',
        location: '/api/import-image?url=',
        recommendation: 'Implement a whitelist of allowed domains and validate all URLs.',
        exploitability: 'Medium',
        references: ['https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/'],
        affectedComponents: ['Image Import API', 'URL Processing Module']
      },
      {
        id: 'CVE-2023-8901',
        name: 'Insufficient Logging & Monitoring',
        severity: 'low',
        category: 'Logging',
        owaspCategory: 'A09:2021-Security Logging and Monitoring Failures',
        description: 'The application does not properly log security-critical events or monitor for suspicious activities.',
        location: 'Application-wide',
        recommendation: 'Implement comprehensive logging and monitoring with alerts for suspicious activities.',
        exploitability: 'Low',
        references: ['https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/'],
        affectedComponents: ['Logging System', 'Monitoring Infrastructure']
      },
      {
        id: 'CVE-2023-6543',
        name: 'Weak Password Policy',
        severity: 'medium',
        category: 'Authentication',
        owaspCategory: 'A07:2021-Identification and Authentication Failures',
        description: 'The application allows weak passwords and does not implement account lockout after failed attempts.',
        location: '/register and /login endpoints',
        recommendation: 'Enforce strong password policy and implement account lockout mechanisms.',
        exploitability: 'Medium',
        references: ['https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/'],
        affectedComponents: ['Authentication System', 'User Registration']
      },
      {
        id: 'CVE-2023-2109',
        name: 'Insecure Deserialization',
        severity: 'high',
        category: 'Deserialization',
        owaspCategory: 'A08:2021-Software and Data Integrity Failures',
        description: 'The application deserializes untrusted data without validation, allowing attackers to execute arbitrary code.',
        location: '/api/load-state',
        recommendation: 'Implement integrity checks and avoid deserializing data from untrusted sources.',
        exploitability: 'High',
        references: ['https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/'],
        affectedComponents: ['State Management API', 'Serialization Library']
      }
    ];

    // Filter vulnerabilities based on enabled scan options
    let result = baseVulnerabilities.filter(vuln => {
      if (vuln.owaspCategory.startsWith('A01') && !options.a01_broken_access) return false;
      if (vuln.owaspCategory.startsWith('A02') && !options.a02_crypto_failures) return false;
      if (vuln.owaspCategory.startsWith('A03') && !options.a03_injection) return false;
      if (vuln.owaspCategory.startsWith('A04') && !options.a04_insecure_design) return false;
      if (vuln.owaspCategory.startsWith('A05') && !options.a05_security_misconfig) return false;
      if (vuln.owaspCategory.startsWith('A06') && !options.a06_vulnerable_components) return false;
      if (vuln.owaspCategory.startsWith('A07') && !options.a07_auth_failures) return false;
      if (vuln.owaspCategory.startsWith('A08') && !options.a08_software_integrity) return false;
      if (vuln.owaspCategory.startsWith('A09') && !options.a09_logging_failures) return false;
      if (vuln.owaspCategory.startsWith('A10') && !options.a10_ssrf) return false;
      return true;
    });

    // If deep scan is enabled, add more vulnerabilities
    if (options.deep_scan) {
      const deepScanVulns = [
        {
          id: 'CVE-2023-9876',
          name: 'XML External Entity (XXE) Injection',
          severity: 'high',
          category: 'XXE',
          owaspCategory: 'A03:2021-Injection',
          description: 'XXE vulnerability in XML processing allows attackers to read local files or perform server-side request forgery.',
          location: '/api/import-xml',
          recommendation: 'Disable XML external entity processing and implement proper input validation.',
          exploitability: 'Medium',
          references: ['https://owasp.org/Top10/A03_2021-Injection/'],
          affectedComponents: ['XML Processor', 'Import Module']
        },
        {
          id: 'CVE-2023-5432',
          name: 'Cross-Site Request Forgery (CSRF)',
          severity: 'medium',
          category: 'CSRF',
          owaspCategory: 'A01:2021-Broken Access Control',
          description: 'Missing CSRF tokens allow attackers to perform actions on behalf of authenticated users.',
          location: '/user/settings',
          recommendation: 'Implement CSRF tokens for all state-changing operations.',
          exploitability: 'Medium',
          references: ['https://owasp.org/Top10/A01_2021-Broken_Access_Control/'],
          affectedComponents: ['Form Submission', 'User Settings']
        }
      ];
      
      // Add deep scan vulnerabilities based on enabled categories
      deepScanVulns.forEach(vuln => {
        if (vuln.owaspCategory.startsWith('A01') && options.a01_broken_access) result.push(vuln);
        else if (vuln.owaspCategory.startsWith('A02') && options.a02_crypto_failures) result.push(vuln);
        else if (vuln.owaspCategory.startsWith('A03') && options.a03_injection) result.push(vuln);
        // Add more conditions for other categories if needed
      });
    }

    // If aggressive scan is enabled, add CVSS scores and more details
    if (options.aggressive) {
      result = result.map(vuln => ({
        ...vuln,
        cvssScore: vuln.severity === 'high' ? (Math.random() * 2 + 7).toFixed(1) : 
                   vuln.severity === 'medium' ? (Math.random() * 2 + 4).toFixed(1) : 
                   (Math.random() * 2 + 1).toFixed(1),
        detectionConfidence: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
        knownExploits: vuln.severity === 'high' ? Math.random() > 0.5 : false
      }));
    }

    // Shuffle array to simulate different results each time
    return result.sort(() => Math.random() - 0.5);
  };

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
          Identify security weaknesses and potential vulnerabilities using OWASP Top 10 methodologies
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CyberCard title="OWASP Top 10 Vulnerability Scan Configuration">
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
              
              <div>
                <h3 className="text-sm font-medium mb-3">OWASP Top 10 Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="a01" 
                      checked={scanOptions.a01_broken_access}
                      onCheckedChange={() => handleOptionChange('a01_broken_access')}
                    />
                    <Label htmlFor="a01" className="text-sm">A01: Broken Access Control</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="a02" 
                      checked={scanOptions.a02_crypto_failures}
                      onCheckedChange={() => handleOptionChange('a02_crypto_failures')}
                    />
                    <Label htmlFor="a02" className="text-sm">A02: Cryptographic Failures</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="a03" 
                      checked={scanOptions.a03_injection}
                      onCheckedChange={() => handleOptionChange('a03_injection')}
                    />
                    <Label htmlFor="a03" className="text-sm">A03: Injection</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="a04" 
                      checked={scanOptions.a04_insecure_design}
                      onCheckedChange={() => handleOptionChange('a04_insecure_design')}
                    />
                    <Label htmlFor="a04" className="text-sm">A04: Insecure Design</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="a05" 
                      checked={scanOptions.a05_security_misconfig}
                      onCheckedChange={() => handleOptionChange('a05_security_misconfig')}
                    />
                    <Label htmlFor="a05" className="text-sm">A05: Security Misconfiguration</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="a06" 
                      checked={scanOptions.a06_vulnerable_components}
                      onCheckedChange={() => handleOptionChange('a06_vulnerable_components')}
                    />
                    <Label htmlFor="a06" className="text-sm">A06: Vulnerable Components</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="a07" 
                      checked={scanOptions.a07_auth_failures}
                      onCheckedChange={() => handleOptionChange('a07_auth_failures')}
                    />
                    <Label htmlFor="a07" className="text-sm">A07: Authentication Failures</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="a08" 
                      checked={scanOptions.a08_software_integrity}
                      onCheckedChange={() => handleOptionChange('a08_software_integrity')}
                    />
                    <Label htmlFor="a08" className="text-sm">A08: Software Integrity Failures</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="a09" 
                      checked={scanOptions.a09_logging_failures}
                      onCheckedChange={() => handleOptionChange('a09_logging_failures')}
                    />
                    <Label htmlFor="a09" className="text-sm">A09: Logging/Monitoring Failures</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="a10" 
                      checked={scanOptions.a10_ssrf}
                      onCheckedChange={() => handleOptionChange('a10_ssrf')}
                    />
                    <Label htmlFor="a10" className="text-sm">A10: Server-Side Request Forgery</Label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-3">Advanced Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="aggressive" 
                      checked={scanOptions.aggressive}
                      onCheckedChange={() => handleOptionChange('aggressive')}
                    />
                    <Label htmlFor="aggressive" className="text-sm">Aggressive Scanning (may trigger WAF/IDS)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="deep_scan" 
                      checked={scanOptions.deep_scan}
                      onCheckedChange={() => handleOptionChange('deep_scan')}
                    />
                    <Label htmlFor="deep_scan" className="text-sm">Deep Scan (more thorough, takes longer)</Label>
                  </div>
                </div>
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
                  'Start OWASP Top 10 Scan'
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
                      <span>2025-05-05 14:30</span>
                      <span>Scan Duration:</span>
                      <span>{scanOptions.deep_scan ? '47' : '12'} seconds</span>
                      <span>Scan Type:</span>
                      <span>OWASP Top 10 {scanOptions.aggressive ? '(Aggressive)' : '(Standard)'}</span>
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
    owaspCategory: string;
    description: string;
    location: string;
    recommendation: string;
    exploitability: string;
    references: string[];
    affectedComponents: string[];
    cvssScore?: string;
    detectionConfidence?: string;
    knownExploits?: boolean;
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
        <div className="font-bold flex items-center gap-2">
          {vuln.severity === 'high' && <AlertTriangle size={14} className="text-cyber-red" />}
          {vuln.name}
        </div>
        <div className="flex items-center gap-2">
          {vuln.cvssScore && (
            <span className={`text-xs font-mono px-2 py-0.5 rounded bg-muted-foreground/20 ${getSeverityColor(vuln.severity)}`}>
              CVSS:{vuln.cvssScore}
            </span>
          )}
          <StatusBadge 
            status={vuln.severity === 'high' ? 'vulnerable' : vuln.severity === 'medium' ? 'unknown' : 'secure'} 
            className={getSeverityColor(vuln.severity)}
          />
        </div>
      </div>
      <div className="text-xs flex justify-between">
        <span>{vuln.id}</span>
        <span>{vuln.owaspCategory}</span>
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
          
          <div className="mb-2">
            <div className="font-medium text-cyber-blue">Affected Components</div>
            <div className="text-xs">{vuln.affectedComponents.join(', ')}</div>
          </div>
          
          {vuln.knownExploits && (
            <div className="mb-2">
              <div className="font-medium text-cyber-red flex items-center gap-1">
                <AlertTriangle size={12} />
                Known Exploits in the Wild
              </div>
            </div>
          )}
          
          <div className="mb-2">
            <div className="font-medium text-cyber-blue">Recommendation</div>
            <div className="text-xs">{vuln.recommendation}</div>
          </div>
          
          <div className="mb-2">
            <div className="font-medium text-cyber-blue">References</div>
            <div className="text-xs">
              {vuln.references.map((ref, idx) => (
                <div key={idx} className="truncate">{ref}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VulnAssessment;
