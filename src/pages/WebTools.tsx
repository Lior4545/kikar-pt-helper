
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const WebTools = () => {
  const [url, setUrl] = useState('');
  const [urlInfo, setUrlInfo] = useState<null | { protocol: string; domain: string; path: string; query: string }>(null);
  
  const [textToEncode, setTextToEncode] = useState('');
  const [encodedText, setEncodedText] = useState('');
  const [textToDecode, setTextToDecode] = useState('');
  const [decodedText, setDecodedText] = useState('');

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

      <Tabs defaultValue="url-parser" className="max-w-2xl">
        <TabsList className="mb-6">
          <TabsTrigger value="url-parser">URL Parser</TabsTrigger>
          <TabsTrigger value="url-encoder">URL Encoder/Decoder</TabsTrigger>
        </TabsList>
        
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
