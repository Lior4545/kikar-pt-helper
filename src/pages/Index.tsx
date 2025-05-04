
import React, { useState } from 'react';
import { 
  Shield,
  Wifi,
  Database,
  Bug,
  Terminal,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import CyberCard from '@/components/common/CyberCard';
import MainLayout from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Index: React.FC = () => {
  const { toast } = useToast();
  const [securityScore, setSecurityScore] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const recentScans = [
    { target: '192.168.1.0/24', type: 'Network Scan', date: '2025-05-04', status: 'Completed' },
    { target: '10.0.0.5', type: 'Port Scan', date: '2025-05-03', status: 'Completed' },
    { target: 'https://example.com', type: 'Web Vulnerability', date: '2025-05-02', status: 'In Progress' }
  ];

  const toolCards = [
    { 
      title: 'Network Scanner',
      icon: <Wifi size={32} className="text-cyber-blue" />,
      description: 'Discover hosts on local network',
      path: '/network-scan'
    },
    { 
      title: 'Port Scanner',
      icon: <Database size={32} className="text-cyber-blue" />,
      description: 'Identify open ports on target hosts',
      path: '/port-scan'
    },
    { 
      title: 'Vulnerability Scanner',
      icon: <Bug size={32} className="text-cyber-blue" />,
      description: 'Check for common vulnerabilities',
      path: '/vuln-assessment'
    },
    { 
      title: 'Terminal',
      icon: <Terminal size={32} className="text-cyber-blue" />,
      description: 'Run custom commands',
      path: '/terminal'
    },
    { 
      title: 'Password Tools',
      icon: <Lock size={32} className="text-cyber-blue" />,
      description: 'Password analysis and cracking',
      path: '/password-tools'
    }
  ];

  const calculateSecurityScore = () => {
    setIsCalculating(true);
    toast({
      title: "Security Calculation",
      description: "Starting security assessment...",
    });
    
    // Simulate calculation
    const timer = setInterval(() => {
      setSecurityScore(prev => {
        const newScore = prev + Math.floor(Math.random() * 10);
        if (newScore >= 75) {
          clearInterval(timer);
          setIsCalculating(false);
          toast({
            title: "Security Assessment Complete",
            description: "Your environment security score: 75/100",
          });
          return 75;
        }
        return newScore;
      });
    }, 500);
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="cyber-card p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 bg-muted p-4 rounded-full">
                <Shield size={48} className="text-cyber-blue" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">Welcome to KikarPT Helper</h1>
                <p className="text-muted-foreground">
                  Your comprehensive toolkit for penetration testing and security assessments.
                  Run scans, analyze vulnerabilities, and improve your security posture.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShieldCheck size={20} className="text-cyber-blue" />
              Quick Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {toolCards.map((tool, index) => (
                <Link to={tool.path} key={index}>
                  <CyberCard className="h-full hover:border-cyber-blue hover:shadow-[0_0_15px_0_theme(colors.cyber.blue)] transition-all">
                    <div className="flex flex-col items-center text-center p-4">
                      <div className="mb-3">{tool.icon}</div>
                      <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </div>
                  </CyberCard>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <CyberCard title="Security Score">
            <div className="text-center py-4">
              <div className="text-4xl font-bold mb-2">{securityScore}/100</div>
              <Progress value={securityScore} className="h-2 mb-4" />
              <Button 
                onClick={calculateSecurityScore} 
                className="bg-cyber-blue hover:bg-cyber-blue/80 text-black"
                disabled={isCalculating}
              >
                {isCalculating ? 'Calculating...' : 'Calculate Score'}
              </Button>
            </div>
          </CyberCard>

          <CyberCard title="Recent Scans">
            <div className="divide-y divide-border">
              {recentScans.map((scan, index) => (
                <div key={index} className="py-3">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">{scan.target}</span>
                    <span className="text-xs text-muted-foreground">{scan.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{scan.type}</span>
                    <span className={scan.status === 'Completed' ? 'text-cyber-green' : 'text-cyber-yellow'}>
                      {scan.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center">
              <Button variant="outline" size="sm">
                View All Scans
              </Button>
            </div>
          </CyberCard>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
