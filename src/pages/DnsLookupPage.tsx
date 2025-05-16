
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DnsLookup from "@/components/DnsLookup";

const DnsLookupPage = () => (
  <div className="min-h-screen bg-black text-white flex flex-col">
    <Header />
    <main className="flex-1 flex flex-col items-center justify-start py-12 px-4">
      <section className="max-w-2xl w-full mb-8 bg-black/60 glass-morphism rounded-xl p-6 shadow border border-purple-800/20 animate-fade-in">
        <h1 className="text-4xl font-extrabold mb-3 text-gradient text-center">DNS Lookup</h1>
        <p className="text-gray-300 mb-4 text-center">
          <span className="font-semibold">DNS (Domain Name System)</span> is like the Internet’s phonebook. 
          It translates domain names (like <span className="text-purple-300">example.com</span>) into IP addresses that computers use to communicate.
        </p>
        <ul className="text-gray-400 text-sm mb-1 list-disc list-inside">
          <li>
            <span className="font-semibold text-white">A</span> – Maps a domain to an IPv4 address.
          </li>
          <li>
            <span className="font-semibold text-white">AAAA</span> – Maps a domain to an IPv6 address.
          </li>
          <li>
            <span className="font-semibold text-white">CNAME</span> – Points a domain to another domain name.
          </li>
          <li>
            <span className="font-semibold text-white">MX</span> – Specifies a domain’s mail servers.
          </li>
          <li>
            <span className="font-semibold text-white">TXT</span> – Holds arbitrary text (often for verification and security).
          </li>
        </ul>
        <p className="text-gray-400 text-xs mt-4 text-center">
          Use the tool below to check these DNS records for any domain. 
          No data is stored.
        </p>
      </section>
      <DnsLookup />
    </main>
    <Footer />
  </div>
);

export default DnsLookupPage;
