
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NetworkScan from "./pages/NetworkScan";
import PortScan from "./pages/PortScan";
import VulnAssessment from "./pages/VulnAssessment";
import Terminal from "./pages/Terminal";
import WebTools from "./pages/WebTools";
import PasswordTools from "./pages/PasswordTools";
import Links from "./pages/Links";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/network-scan" element={<NetworkScan />} />
          <Route path="/port-scan" element={<PortScan />} />
          <Route path="/vuln-assessment" element={<VulnAssessment />} />
          <Route path="/web-tools" element={<WebTools />} />
          <Route path="/terminal" element={<Terminal />} />
          <Route path="/password-tools" element={<PasswordTools />} />
          <Route path="/links" element={<Links />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
