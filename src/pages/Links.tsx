
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const Links = () => {
  const resources = [
    {
      category: "Vulnerability Databases",
      links: [
        { name: "CVE Details", url: "https://www.cvedetails.com/", description: "Security vulnerability database" },
        { name: "NVD", url: "https://nvd.nist.gov/", description: "National Vulnerability Database" },
        { name: "Exploit Database", url: "https://www.exploit-db.com/", description: "Archive of exploits and vulnerable software" },
      ]
    },
    {
      category: "Tools & Resources",
      links: [
        { name: "OWASP", url: "https://owasp.org/", description: "Open Web Application Security Project" },
        { name: "HackTricks", url: "https://book.hacktricks.xyz/", description: "Pentesting methodology and techniques" },
        { name: "GTFOBins", url: "https://gtfobins.github.io/", description: "Unix binaries that can be used to bypass security restrictions" },
      ]
    },
    {
      category: "Learning Resources",
      links: [
        { name: "HackTheBox", url: "https://www.hackthebox.eu/", description: "Cybersecurity training platform" },
        { name: "TryHackMe", url: "https://tryhackme.com/", description: "Learn cybersecurity through hands-on exercises" },
        { name: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security", description: "Free web security training" },
      ]
    },
  ];

  return (
    <MainLayout>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Useful Links</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mt-4 mb-6">Useful Links</h1>
      <p className="text-muted-foreground mb-8">Collection of valuable resources for penetration testing and security research</p>

      <div className="space-y-8">
        {resources.map((category) => (
          <div key={category.category}>
            <h2 className="text-xl font-semibold mb-4">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.links.map((link) => (
                <Card key={link.name} className="cyber-border">
                  <CardHeader>
                    <CardTitle>{link.name}</CardTitle>
                    <CardDescription>{link.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyber-blue hover:underline"
                    >
                      Visit Website
                    </a>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Links;
