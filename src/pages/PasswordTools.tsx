
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { toast } from "@/hooks/use-toast";
import { useToast } from "@/hooks/use-toast";

const PasswordTools = () => {
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  
  const [passwordToCheck, setPasswordToCheck] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<null | 'weak' | 'medium' | 'strong'>(null);

  const { toast } = useToast();

  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    let chars = lowercase;
    if (includeUppercase) chars += uppercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;
    
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    
    setGeneratedPassword(password);
    toast({
      title: "Password Generated",
      description: "Your secure password has been created.",
    });
  };

  const checkPasswordStrength = () => {
    if (!passwordToCheck) {
      setPasswordStrength(null);
      return;
    }
    
    // Basic password strength check
    const hasLowercase = /[a-z]/.test(passwordToCheck);
    const hasUppercase = /[A-Z]/.test(passwordToCheck);
    const hasNumbers = /[0-9]/.test(passwordToCheck);
    const hasSymbols = /[^A-Za-z0-9]/.test(passwordToCheck);
    
    const count = [hasLowercase, hasUppercase, hasNumbers, hasSymbols].filter(Boolean).length;
    
    if (passwordToCheck.length < 8 || count <= 2) {
      setPasswordStrength('weak');
    } else if (passwordToCheck.length >= 8 && count === 3) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
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
            <BreadcrumbLink>Password Tools</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mt-4 mb-6">Password Tools</h1>

      <Tabs defaultValue="generator" className="max-w-2xl">
        <TabsList className="mb-6">
          <TabsTrigger value="generator">Password Generator</TabsTrigger>
          <TabsTrigger value="checker">Password Strength Checker</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator">
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle>Password Generator</CardTitle>
              <CardDescription>Create strong, secure passwords with custom requirements.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Password Length: {passwordLength}</Label>
                  </div>
                  <Slider 
                    value={[passwordLength]}
                    onValueChange={(value) => setPasswordLength(value[0])} 
                    min={6} 
                    max={32} 
                    step={1}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="uppercase" 
                      checked={includeUppercase} 
                      onCheckedChange={(checked) => setIncludeUppercase(!!checked)} 
                    />
                    <Label htmlFor="uppercase">Include Uppercase Letters</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="numbers" 
                      checked={includeNumbers} 
                      onCheckedChange={(checked) => setIncludeNumbers(!!checked)} 
                    />
                    <Label htmlFor="numbers">Include Numbers</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="symbols" 
                      checked={includeSymbols} 
                      onCheckedChange={(checked) => setIncludeSymbols(!!checked)} 
                    />
                    <Label htmlFor="symbols">Include Symbols</Label>
                  </div>
                </div>
                
                {generatedPassword && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <p className="font-mono break-all">{generatedPassword}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={generatePassword}>Generate Password</Button>
              {generatedPassword && (
                <Button 
                  variant="outline" 
                  className="ml-2"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPassword);
                    toast({
                      title: "Copied!",
                      description: "Password copied to clipboard",
                    });
                  }}
                >
                  Copy to Clipboard
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="checker">
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle>Password Strength Checker</CardTitle>
              <CardDescription>Evaluate the strength of your passwords.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordCheck">Enter a password to check:</Label>
                  <Input 
                    id="passwordCheck"
                    type="text" 
                    value={passwordToCheck} 
                    onChange={(e) => setPasswordToCheck(e.target.value)}
                    placeholder="Enter password to analyze"
                  />
                </div>
                
                {passwordStrength && (
                  <div className="mt-4">
                    <p>Password Strength: </p>
                    <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          passwordStrength === 'weak' ? 'w-1/3 bg-red-500' : 
                          passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' : 
                          'w-full bg-green-500'
                        }`}
                      />
                    </div>
                    <p className="mt-2 text-sm">
                      {passwordStrength === 'weak' ? 'Weak: Consider using a stronger password' : 
                       passwordStrength === 'medium' ? 'Medium: This password is reasonably secure' : 
                       'Strong: This password has good security characteristics'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={checkPasswordStrength}>Check Strength</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default PasswordTools;
