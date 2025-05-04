
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Shield, 
  Wifi, 
  Database, 
  Bug, 
  Code, 
  Terminal, 
  Link as LinkIcon,
  Lock
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Shield size={20} /> },
    { path: '/network-scan', label: 'Network Scan', icon: <Wifi size={20} /> },
    { path: '/port-scan', label: 'Port Scan', icon: <Database size={20} /> },
    { path: '/vuln-assessment', label: 'Vulnerability Assessment', icon: <Bug size={20} /> },
    { path: '/web-tools', label: 'Web Tools', icon: <Code size={20} /> },
    { path: '/terminal', label: 'Terminal', icon: <Terminal size={20} /> },
    { path: '/password-tools', label: 'Password Tools', icon: <Lock size={20} /> },
    { path: '/links', label: 'Useful Links', icon: <LinkIcon size={20} /> },
  ];

  return (
    <aside className="bg-sidebar w-full md:w-64 md:min-h-screen cyber-border">
      <div className="p-4 text-center">
        <div className="font-bold text-xl mb-2 text-cyber-blue">KikarPT</div>
        <div className="text-xs text-muted-foreground">Penetration Testing Assistant</div>
      </div>
      
      <nav className="py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    isActive
                      ? 'bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30'
                      : 'hover:bg-muted'
                  }`
                }
              >
                <span className={({ isActive }) => isActive ? 'text-cyber-blue' : ''}>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto p-4 border-t border-sidebar-border">
        <div className="text-xs text-center text-muted-foreground">
          <p>KikarPT Helper v1.0.0</p>
          <p className="mt-1">© 2025 Security Tools</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
