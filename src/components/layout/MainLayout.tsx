
import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Shield } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6">
        <header className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 hover:text-cyber-blue transition-colors">
            <Shield size={24} className="text-cyber-blue" />
            <h1 className="text-2xl font-bold">KikarPT</h1>
          </Link>
          <div className="flex items-center gap-2">
            <div className="cyber-dot-red animate-pulse"></div>
            <div className="cyber-dot-yellow animate-pulse delay-75"></div>
            <div className="cyber-dot animate-pulse delay-150"></div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
