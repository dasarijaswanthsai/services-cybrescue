
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DnsLookup from "@/components/DnsLookup";

const DnsLookupPage = () => (
  <div className="min-h-screen bg-black text-white flex flex-col">
    <Header />
    <main className="flex-1 flex flex-col items-center justify-center">
      <DnsLookup />
    </main>
    <Footer />
  </div>
);

export default DnsLookupPage;
