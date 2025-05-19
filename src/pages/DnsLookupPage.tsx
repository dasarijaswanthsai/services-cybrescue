import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DnsLookup from "@/components/DnsLookup";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Box, Boxes } from "lucide-react";

const dnsRecordDetails = [
  {
    type: "A",
    title: "A Record",
    desc: "Maps a domain to an IPv4 address.",
  },
  {
    type: "AAAA",
    title: "AAAA Record",
    desc: "Maps a domain to an IPv6 address.",
  },
  {
    type: "CNAME",
    title: "CNAME Record",
    desc: "Aliases one domain to another domain name.",
  },
  {
    type: "MX",
    title: "MX Record",
    desc: "Specifies a domain’s mail servers.",
  },
  {
    type: "TXT",
    title: "TXT Record",
    desc: "Holds arbitrary text (verification, SPF/DKIM, security).",
  },
  {
    type: "NS",
    title: "NS Record",
    desc: "Identifies the name servers for the domain.",
  },
  {
    type: "PTR",
    title: "PTR Record",
    desc: "Used for reverse DNS lookups (IP to hostname).",
  },
  {
    type: "SRV",
    title: "SRV Record",
    desc: "Specifies services available for the domain (e.g., SIP, XMPP).",
  },
  {
    type: "SOA",
    title: "SOA Record",
    desc: "Contains admin info about the zone (authoritative).",
  },
];

const ipClassDetails = [
  {
    class: "A",
    range: "1.0.0.0 – 126.255.255.255",
    defaultMask: "255.0.0.0 (/8)",
    hosts: "16,777,214",
    desc: "Used for large networks. Starts with 1–126.",
  },
  {
    class: "B",
    range: "128.0.0.0 – 191.255.255.255",
    defaultMask: "255.255.0.0 (/16)",
    hosts: "65,534",
    desc: "Medium-sized networks. Starts with 128–191.",
  },
  {
    class: "C",
    range: "192.0.0.0 – 223.255.255.255",
    defaultMask: "255.255.255.0 (/24)",
    hosts: "254",
    desc: "Small networks. Starts with 192–223.",
  },
  {
    class: "D",
    range: "224.0.0.0 – 239.255.255.255",
    defaultMask: "N/A",
    hosts: "Multicast (not for end-users)",
    desc: "Reserved for multicast groups.",
  },
  {
    class: "E",
    range: "240.0.0.0 – 255.255.255.255",
    defaultMask: "N/A",
    hosts: "Experimental",
    desc: "Reserved for research/experimental use.",
  },
];


const DnsLookupPage = () => (
  <div className="min-h-screen bg-black text-white flex flex-col">
    <Header />
    <main className="flex-1 flex flex-col items-center justify-start py-12 px-4">
      {/* === TOOL (DnsLookup) MOVED TO TOP === */}
      <DnsLookup />

      {/* DNS Record Details */}
      <section className="w-full max-w-3xl grid md:grid-cols-2 gap-6 my-8">
        {dnsRecordDetails.map((rec) => (
          <Card key={rec.type} className="glass-morphism border border-purple-700/60 bg-black/70 text-white">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Box size={24} className="text-purple-300" />
              <CardTitle className="text-lg">{rec.title} <span className="ml-2 text-purple-400 font-mono">{rec.type}</span></CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">{rec.desc}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* IP Classes & Ranges */}
      <section className="w-full max-w-3xl my-8">
        <h2 className="text-2xl font-bold mb-4 text-gradient flex items-center gap-2">
          <Boxes size={28} className="text-purple-400" /> IP Address Classes & Ranges
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {ipClassDetails.map((ipclass) => (
            <Card key={ipclass.class} className="border border-purple-800/40 bg-black/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  Class {ipclass.class}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-[15px] text-gray-300 mb-2">{ipclass.desc}</div>
                <div className="text-xs text-purple-400 mb-1">
                  <b>Range:</b> {ipclass.range}
                </div>
                <div className="text-xs mb-1">
                  <b>Default Mask:</b> {ipclass.defaultMask}
                </div>
                <div className="text-xs mb-1">
                  <b>Hosts:</b> {ipclass.hosts}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
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
          Use the tool above to check these DNS records for any domain. 
          No data is stored.
        </p>
      </section>
    </main>
    <Footer />
  </div>
);

export default DnsLookupPage;
