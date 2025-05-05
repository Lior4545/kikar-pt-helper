
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Loader, FolderSearch, Globe } from 'lucide-react';
import CyberCard from '@/components/common/CyberCard';
import TerminalOutput from '@/components/common/TerminalOutput';
import StatusBadge from '@/components/common/StatusBadge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

const WebTools = () => {
  const [url, setUrl] = useState('');
  const [urlInfo, setUrlInfo] = useState<null | { protocol: string; domain: string; path: string; query: string }>(null);
  
  const [textToEncode, setTextToEncode] = useState('');
  const [encodedText, setEncodedText] = useState('');
  const [textToDecode, setTextToDecode] = useState('');
  const [decodedText, setDecodedText] = useState('');

  // Directory scanning state
  const [targetUrl, setTargetUrl] = useState('https://example.com');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanInProgress, setScanInProgress] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [foundPaths, setFoundPaths] = useState<{path: string, status: number, type: string, size: string}[]>([]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [wordlist, setWordlist] = useState('common');

  const { toast } = useToast();

  const parseUrl = () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL to parse",
        variant: "destructive"
      });
      return;
    }

    try {
      const parsedUrl = new URL(url);
      setUrlInfo({
        protocol: parsedUrl.protocol,
        domain: parsedUrl.hostname,
        path: parsedUrl.pathname,
        query: parsedUrl.search
      });
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including the protocol (e.g. https://example.com)",
        variant: "destructive"
      });
    }
  };

  const encodeText = () => {
    if (!textToEncode) return;
    
    try {
      setEncodedText(encodeURIComponent(textToEncode));
      toast({
        title: "Text Encoded",
        description: "URL encoding completed successfully."
      });
    } catch (error) {
      toast({
        title: "Encoding Error",
        description: "An error occurred while encoding the text.",
        variant: "destructive"
      });
    }
  };

  const decodeText = () => {
    if (!textToDecode) return;
    
    try {
      setDecodedText(decodeURIComponent(textToDecode));
      toast({
        title: "Text Decoded",
        description: "URL decoding completed successfully."
      });
    } catch (error) {
      toast({
        title: "Decoding Error",
        description: "An error occurred while decoding the text. Make sure the input is valid URL encoded text.",
        variant: "destructive"
      });
    }
  };

  const startDirectoryScan = () => {
    if (!targetUrl) {
      toast({
        title: "Input Error",
        description: "Please enter a target URL to scan",
        variant: "destructive"
      });
      return;
    }

    try {
      new URL(targetUrl);
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including the protocol (e.g. https://example.com)",
        variant: "destructive"
      });
      return;
    }

    setScanInProgress(true);
    setScanCompleted(false);
    setScanProgress(0);
    setTerminalOutput([
      `Starting directory enumeration on ${targetUrl}`,
      `Using wordlist: ${wordlist}`,
      `Initializing scan engine...`
    ]);
    setFoundPaths([]);

    // Simulate scan progress
    const intervalId = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 3);
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 150);

    // Simulate found paths gradually
    const mockPaths = generateMockPaths();
    const pathTimeouts: NodeJS.Timeout[] = [];
    
    mockPaths.forEach((path, index) => {
      const timeout = setTimeout(() => {
        setFoundPaths(prev => [...prev, path]);
        setTerminalOutput(prev => [...prev, `[${path.status}] /${path.path}`]);
      }, 1000 + (index * 500));
      pathTimeouts.push(timeout);
    });

    const finalTimeout = setTimeout(() => {
      clearInterval(intervalId);
      setScanProgress(100);
      setScanInProgress(false);
      setScanCompleted(true);
      setTerminalOutput(prev => [
        ...prev, 
        `Scan completed. Found ${mockPaths.length} paths.`,
        `Total requests: ${mockPaths.length + Math.floor(Math.random() * 200)}`,
        `Elapsed time: ${Math.floor(Math.random() * 30) + 5} seconds`
      ]);
      
      toast({
        title: "Directory Scan Complete",
        description: `Found ${mockPaths.length} paths on ${targetUrl}`,
      });
    }, Math.min(mockPaths.length * 500 + 2000, 15000));
    
    return () => {
      clearInterval(intervalId);
      pathTimeouts.forEach(id => clearTimeout(id));
      clearTimeout(finalTimeout);
    };
  };

  const generateMockPaths = () => {
    const paths = [
      { path: "", status: 200, type: "directory", size: "-" },
      { path: "admin", status: 403, type: "directory", size: "-" },
      { path: "images", status: 200, type: "directory", size: "-" },
      { path: "css", status: 200, type: "directory", size: "-" },
      { path: "js", status: 200, type: "directory", size: "-" },
      { path: "api", status: 200, type: "directory", size: "-" },
      { path: "login.php", status: 200, type: "file", size: "2.3KB" },
      { path: "register.php", status: 200, type: "file", size: "1.8KB" },
      { path: "config.bak", status: 200, type: "file", size: "512B" },
      { path: "robots.txt", status: 200, type: "file", size: "128B" },
      { path: ".htaccess", status: 403, type: "file", size: "-" },
      { path: "backup", status: 403, type: "directory", size: "-" },
      { path: "includes", status: 403, type: "directory", size: "-" },
      { path: "upload.php", status: 200, type: "file", size: "3.1KB" },
      { path: "admin/login.php", status: 200, type: "file", size: "1.7KB" },
      { path: "admin/index.php", status: 302, type: "file", size: "1.2KB" },
      { path: "api/v1", status: 200, type: "directory", size: "-" },
      { path: "api/v2", status: 200, type: "directory", size: "-" }
    ];
    
    // Return random subset of paths to simulate different results each time
    return paths.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 10) + 8);
  };

  return (
    <MainLayout>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Web Tools</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mt-4 mb-6">Web Tools</h1>

      <Tabs defaultValue="dir-scanner" className="max-w-4xl">
        <TabsList className="mb-6">
          <TabsTrigger value="dir-scanner">Directory Scanner</TabsTrigger>
          <TabsTrigger value="url-parser">URL Parser</TabsTrigger>
          <TabsTrigger value="url-encoder">URL Encoder/Decoder</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dir-scanner">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CyberCard title="Directory Scanner Configuration">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="target-url" className="block text-sm font-medium mb-1">
                      Target URL
                    </label>
                    <Input
                      id="target-url"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="bg-muted"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="wordlist" className="block text-sm font-medium mb-1">
                      Wordlist
                    </label>
                    <select
                      id="wordlist"
                      value={wordlist}
                      onChange={(e) => setWordlist(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="common">Common Files (1,000 entries)</option>
                      <option value="medium">Medium List (10,000 entries)</option>
                      <option value="large">Large List (100,000 entries)</option>
                      <option value="huge">OWASP Complete (300,000+ entries)</option>
                    </select>
                  </div>
                  
                  <Button
                    onClick={startDirectoryScan}
                    disabled={scanInProgress}
                    className="bg-cyber-blue text-black hover:bg-cyber-blue/80"
                  >
                    {scanInProgress ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      'Start Directory Scan'
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
              <CyberCard title="Found Paths">
                {foundPaths.length > 0 ? (
                  <div className="space-y-3 max-h-[500px] overflow-auto pr-2">
                    {foundPaths.map((item, index) => (
                      <div 
                        key={index}
                        className="bg-muted p-3 rounded-md hover:bg-muted/80 cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <FolderSearch size={14} className="text-cyber-blue" />
                            <span className="font-mono">/{item.path}</span>
                          </div>
                          <StatusBadge status={item.status === 200 ? "open" : item.status === 403 ? "vulnerable" : "unknown"} />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-1">
                          <div>Status: {item.status}</div>
                          <div>Type: {item.type}</div>
                          {item.size !== "-" && <div>Size: {item.size}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {scanInProgress ? (
                      <div className="flex flex-col items-center">
                        <Loader className="h-8 w-8 animate-spin mb-2 text-cyber-blue" />
                        <p>Scanning for directories and files...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <FolderSearch className="h-8 w-8 mb-2 text-cyber-blue" />
                        <p>Run a scan to discover paths</p>
                      </div>
                    )}
                  </div>
                )}
              </CyberCard>

              <CyberCard title="Scan Statistics">
                {scanCompleted ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Total Paths:</div>
                      <div>{foundPaths.length}</div>
                      
                      <div className="font-medium">Open (200):</div>
                      <div>{foundPaths.filter(p => p.status === 200).length}</div>
                      
                      <div className="font-medium">Forbidden (403):</div>
                      <div>{foundPaths.filter(p => p.status === 403).length}</div>
                      
                      <div className="font-medium">Other Status:</div>
                      <div>{foundPaths.filter(p => p.status !== 200 && p.status !== 403).length}</div>
                      
                      <div className="font-medium">Directories:</div>
                      <div>{foundPaths.filter(p => p.type === "directory").length}</div>
                      
                      <div className="font-medium">Files:</div>
                      <div>{foundPaths.filter(p => p.type === "file").length}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No scan statistics available
                  </div>
                )}
              </CyberCard>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="url-parser">
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle>URL Parser</CardTitle>
              <CardDescription>Analyze and break down URLs into their components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url-input">URL to parse:</Label>
                  <Input 
                    id="url-input"
                    type="text" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/path?query=value"
                  />
                </div>
                
                {urlInfo && (
                  <div className="mt-4 space-y-2 p-4 bg-muted rounded-md">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-bold">Protocol:</span>
                      <span className="col-span-2 font-mono">{urlInfo.protocol}</span>
                      
                      <span className="font-bold">Domain:</span>
                      <span className="col-span-2 font-mono">{urlInfo.domain}</span>
                      
                      <span className="font-bold">Path:</span>
                      <span className="col-span-2 font-mono">{urlInfo.path || "/"}</span>
                      
                      <span className="font-bold">Query String:</span>
                      <span className="col-span-2 font-mono break-all">{urlInfo.query || "none"}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={parseUrl}>Parse URL</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="url-encoder">
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle>URL Encoder/Decoder</CardTitle>
              <CardDescription>Encode or decode text for use in URLs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label>URL Encode:</Label>
                  <Textarea 
                    value={textToEncode} 
                    onChange={(e) => setTextToEncode(e.target.value)}
                    placeholder="Enter text to encode"
                    className="min-h-[100px]"
                  />
                  
                  {encodedText && (
                    <div className="p-3 bg-muted rounded-md">
                      <Label className="block mb-2">Encoded result:</Label>
                      <div className="font-mono text-sm break-all">{encodedText}</div>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => {
                          navigator.clipboard.writeText(encodedText);
                          toast({ title: "Copied to clipboard" });
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  )}
                  <Button onClick={encodeText}>Encode</Button>
                </div>
                
                <div className="pt-4 border-t space-y-4">
                  <Label>URL Decode:</Label>
                  <Textarea 
                    value={textToDecode} 
                    onChange={(e) => setTextToDecode(e.target.value)}
                    placeholder="Enter text to decode"
                    className="min-h-[100px]"
                  />
                  
                  {decodedText && (
                    <div className="p-3 bg-muted rounded-md">
                      <Label className="block mb-2">Decoded result:</Label>
                      <div className="font-mono text-sm break-all">{decodedText}</div>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => {
                          navigator.clipboard.writeText(decodedText);
                          toast({ title: "Copied to clipboard" });
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  )}
                  <Button onClick={decodeText}>Decode</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default WebTools;
