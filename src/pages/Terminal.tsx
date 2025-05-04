
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const Terminal = () => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<string[]>([
    'Welcome to KikarPT Terminal',
    'Type "help" for available commands',
  ]);

  const handleCommand = () => {
    const newOutput = [...output, `$ ${command}`];

    // Simple command handling logic
    switch (command.toLowerCase()) {
      case 'help':
        newOutput.push('Available commands:');
        newOutput.push('- help: Show this help message');
        newOutput.push('- clear: Clear the terminal');
        newOutput.push('- version: Show version information');
        break;
      case 'clear':
        setCommand('');
        setOutput([
          'Terminal cleared',
          'Welcome to KikarPT Terminal',
          'Type "help" for available commands',
        ]);
        return;
      case 'version':
        newOutput.push('KikarPT Terminal v1.0');
        newOutput.push('Running on React 18.3.1');
        break;
      case '':
        // Do nothing for empty commands
        break;
      default:
        newOutput.push(`Command not found: ${command}`);
    }

    setOutput(newOutput);
    setCommand('');
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
            <BreadcrumbLink>Terminal</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mt-4 mb-6">Terminal</h1>
      
      <div className="cyber-border bg-black/90 text-green-400 p-4 h-96 rounded-md font-mono overflow-auto">
        {output.map((line, index) => (
          <div key={index} className="mb-1">
            {line}
          </div>
        ))}
        
        <div className="flex items-center mt-2">
          <span className="mr-2">$</span>
          <Input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
            className="bg-transparent border-none text-green-400 focus-visible:ring-0 flex-1"
            placeholder="Type a command..."
          />
        </div>
      </div>
      
      <div className="mt-4 flex gap-2">
        <Button onClick={handleCommand}>Execute</Button>
        <Button 
          variant="outline" 
          onClick={() => {
            setCommand('');
            setOutput([
              'Terminal cleared',
              'Welcome to KikarPT Terminal',
              'Type "help" for available commands',
            ]);
          }}
        >
          Clear
        </Button>
      </div>
    </MainLayout>
  );
};

export default Terminal;
