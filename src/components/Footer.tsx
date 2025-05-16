
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 px-4 sm:px-6 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/3d9f8525-552e-45bb-a160-4de8542fb6b6.png" 
              alt="CybRescue Logo" 
              className="h-6" 
            />
          </div>
          <nav className="flex items-center gap-6">
            <a href="#generator" className="text-sm text-gray-300 hover:text-white transition-colors">
              Generator
            </a>
            <a href="#checker" className="text-sm text-gray-300 hover:text-white transition-colors">
              Checker
            </a>
            <a href="#tips" className="text-sm text-gray-300 hover:text-white transition-colors">
              Tips
            </a>
            <a href="#dnslookup" className="text-sm text-purple-400 hover:text-white transition-colors">
              DNS Lookup
            </a>
          </nav>
        </div>
        <div className="text-center text-sm text-gray-400">
          <p className="mb-2">
            This is a static demo site. No passwords are stored or transmitted.
          </p>
          <p>
            © {new Date().getFullYear()} CybRescue. All password operations are performed locally in your browser.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
