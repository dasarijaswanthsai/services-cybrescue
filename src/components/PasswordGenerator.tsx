
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Clipboard, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const { toast } = useToast();

  // Generate password whenever options change
  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeAmbiguous]);

  const generatePassword = () => {
    let charset = '';
    
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+{}|:"<>?-=[]\\;\',./';
    
    // Remove ambiguous characters if option is selected
    if (excludeAmbiguous) {
      charset = charset.replace(/[1lI0O]/g, '');
    }

    // Ensure at least one character set is selected
    if (charset === '') {
      setPassword('Please select at least one character type');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }

    setPassword(newPassword);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast({
      title: "Copied to clipboard",
      description: "Your generated password has been copied to your clipboard.",
    });
  };

  return (
    <section id="generator" className="py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          <span className="text-gradient">Password Generator</span>
        </h2>
        
        <div className="glass gradient-border rounded-xl p-6 md:p-8 animate-slide-up">
          <div className="mb-6 relative">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-300">Your Generated Password</label>
              <div className="text-xs text-gray-400">{length} characters</div>
            </div>
            <div className="flex w-full">
              <input
                type="text"
                className="w-full py-3 px-4 rounded-l-lg bg-purple-900/20 border border-purple-500/30 text-lg"
                value={password}
                readOnly
              />
              <Button
                onClick={copyToClipboard}
                className="rounded-l-none rounded-r-lg bg-purple-600 hover:bg-purple-700"
              >
                <Clipboard className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="text-sm text-gray-300 mb-3 block">Password Length: {length}</label>
            <Slider 
              value={[length]}
              min={8}
              max={32}
              step={1}
              onValueChange={(value) => setLength(value[0])}
              className="py-2"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center justify-between p-3 bg-purple-800/10 rounded-lg">
              <label htmlFor="uppercase" className="text-sm">Include Uppercase</label>
              <Switch
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={setIncludeUppercase}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-800/10 rounded-lg">
              <label htmlFor="lowercase" className="text-sm">Include Lowercase</label>
              <Switch
                id="lowercase"
                checked={includeLowercase}
                onCheckedChange={setIncludeLowercase}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-800/10 rounded-lg">
              <label htmlFor="numbers" className="text-sm">Include Numbers</label>
              <Switch
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={setIncludeNumbers}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-800/10 rounded-lg">
              <label htmlFor="symbols" className="text-sm">Include Symbols</label>
              <Switch
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={setIncludeSymbols}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-purple-800/10 rounded-lg mb-6">
            <label htmlFor="ambiguous" className="text-sm">
              Exclude Ambiguous Characters (1, l, I, 0, O)
            </label>
            <Switch
              id="ambiguous"
              checked={excludeAmbiguous}
              onCheckedChange={setExcludeAmbiguous}
            />
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={generatePassword}
              className="px-6 py-2 flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg transition-all text-white border-0"
            >
              <RefreshCw className="h-4 w-4" /> Generate New Password
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PasswordGenerator;
