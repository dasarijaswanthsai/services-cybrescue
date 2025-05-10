
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface StrengthCheck {
  name: string;
  passes: boolean;
  description: string;
}

const PasswordStrengthChecker: React.FC = () => {
  const [password, setPassword] = useState('');
  const [score, setScore] = useState(0);
  const [strengthText, setStrengthText] = useState('');
  const [strengthClass, setStrengthClass] = useState('bg-gray-500');
  const [checks, setChecks] = useState<StrengthCheck[]>([
    { name: 'length', passes: false, description: 'At least 8 characters long' },
    { name: 'uppercase', passes: false, description: 'Contains uppercase letters' },
    { name: 'lowercase', passes: false, description: 'Contains lowercase letters' },
    { name: 'numbers', passes: false, description: 'Contains numbers' },
    { name: 'special', passes: false, description: 'Contains special characters' },
    { name: 'common', passes: false, description: 'Not a common password' },
  ]);

  const commonPasswords = [
    'password', '12345678', 'qwerty', 'admin', '123456789', 'password1', 
    'abc123', '1234567', '123123', 'qwerty123', 'welcome', 'monkey'
  ];

  useEffect(() => {
    if (!password) {
      setScore(0);
      setStrengthText('');
      setStrengthClass('bg-gray-500');
      setChecks(checks.map(check => ({ ...check, passes: false })));
      return;
    }

    // Check for password patterns
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const isLongEnough = password.length >= 8;
    const isNotCommon = !commonPasswords.includes(password.toLowerCase());

    // Update check statuses
    const updatedChecks = [
      { name: 'length', passes: isLongEnough, description: 'At least 8 characters long' },
      { name: 'uppercase', passes: hasUpperCase, description: 'Contains uppercase letters' },
      { name: 'lowercase', passes: hasLowerCase, description: 'Contains lowercase letters' },
      { name: 'numbers', passes: hasNumbers, description: 'Contains numbers' },
      { name: 'special', passes: hasSpecialChars, description: 'Contains special characters' },
      { name: 'common', passes: isNotCommon, description: 'Not a common password' },
    ];
    
    setChecks(updatedChecks);
    
    // Calculate password strength score (0-100)
    let calculatedScore = 0;
    if (isLongEnough) calculatedScore += 20;
    if (hasUpperCase) calculatedScore += 15;
    if (hasLowerCase) calculatedScore += 15;
    if (hasNumbers) calculatedScore += 15;
    if (hasSpecialChars) calculatedScore += 15;
    if (isNotCommon) calculatedScore += 20;
    
    // Additional points for longer passwords
    if (password.length >= 12) calculatedScore += 10;
    if (password.length >= 16) calculatedScore += 10;
    
    // Cap score at 100
    calculatedScore = Math.min(calculatedScore, 100);
    
    // Set strength text and class based on score
    let text = '';
    let colorClass = '';
    
    if (calculatedScore < 20) {
      text = 'Very Weak';
      colorClass = 'bg-red-600';
    } else if (calculatedScore < 40) {
      text = 'Weak';
      colorClass = 'bg-orange-500';
    } else if (calculatedScore < 60) {
      text = 'Moderate';
      colorClass = 'bg-yellow-500';
    } else if (calculatedScore < 80) {
      text = 'Strong';
      colorClass = 'bg-green-500';
    } else {
      text = 'Very Strong';
      colorClass = 'bg-emerald-500';
    }
    
    setScore(calculatedScore);
    setStrengthText(text);
    setStrengthClass(colorClass);
    
  }, [password]);

  return (
    <section id="checker" className="py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          <span className="text-gradient">Password Strength Checker</span>
        </h2>
        
        <div className="glass gradient-border rounded-xl p-6 md:p-8 animate-slide-up">
          <div className="mb-6">
            <label className="text-sm text-gray-300 block mb-2">Enter Your Password</label>
            <input
              type="password"
              className="w-full py-3 px-4 rounded-lg bg-purple-900/20 border border-purple-500/30 text-lg"
              placeholder="Type your password to check strength"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Strength</span>
              <span className="text-sm font-semibold">{strengthText || 'No password entered'}</span>
            </div>
            <Progress 
              value={score} 
              className={`h-2 ${strengthClass} transition-all duration-300`}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {checks.map((check) => (
              <div 
                key={check.name} 
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  check.passes 
                    ? 'bg-green-500/10 border border-green-500/30' 
                    : password 
                      ? 'bg-red-500/10 border border-red-500/20'
                      : 'bg-gray-500/10 border border-gray-500/20'
                }`}
              >
                <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                  check.passes 
                    ? 'bg-green-500' 
                    : password 
                      ? 'bg-red-500'
                      : 'bg-gray-500'
                }`}></div>
                <span className="text-sm">{check.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PasswordStrengthChecker;
