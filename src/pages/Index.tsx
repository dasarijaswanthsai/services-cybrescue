
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PasswordGenerator from '@/components/PasswordGenerator';
import PasswordStrengthChecker from '@/components/PasswordStrengthChecker';
import PasswordTips from '@/components/PasswordTips';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <Hero />
        <PasswordGenerator />
        <PasswordStrengthChecker />
        <PasswordTips />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
