
import React from "react";
import { ShieldCheck } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-4 sm:px-6 flex justify-between items-center z-20 relative">
      <div className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/3d9f8525-552e-45bb-a160-4de8542fb6b6.png" 
          alt="CybRescue Logo" 
          className="h-8" 
        />
      </div>
      
      <nav className="hidden md:flex items-center gap-6">
        <a href="#generator" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
          Generator
        </a>
        <a href="#checker" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
          Strength Checker
        </a>
        <a href="#tips" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
          Password Tips
        </a>
        <a href="/dnslookup" className="text-sm font-medium text-purple-400 hover:text-white transition-colors">
          DNS Lookup
        </a>
        <a href="/subnet-calculator" className="text-sm font-medium text-purple-400 hover:text-white transition-colors">
          Subnet Calculator
        </a>
      </nav>
      
      <a 
        href="https://github.com" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="px-4 py-1.5 text-sm font-medium rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all"
      >
        GitHub
      </a>
    </header>
  );
};

export default Header;
