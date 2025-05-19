
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Result = {
  networkAddress: string;
  broadcastAddress: string;
  numberOfHosts: number;
  firstHost: string;
  lastHost: string;
  maskBits: number;
};

function ipv4StringToInt(ip: string) {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some(n => isNaN(n) || n < 0 || n > 255)) return null;
  return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
}

function intToIpv4String(num: number) {
  return [
    (num >> 24) & 255,
    (num >> 16) & 255,
    (num >> 8) & 255,
    num & 255
  ].join(".");
}

function maskFromBits(bits: number) {
  return bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
}

function validateIpv4(ip: string) {
  const parts = ip.split(".");
  return (
    parts.length === 4 &&
    parts.every((p) => {
      const n = Number(p);
      return String(n) === p && n >= 0 && n <= 255;
    })
  );
}

function validateMask(mask: string): number | null {
  if (/^\d+$/.test(mask)) {
    const n = Number(mask);
    if (n >= 0 && n <= 32) return n;
  }
  // check dot-decimal
  if (validateIpv4(mask)) {
    const int = ipv4StringToInt(mask);
    if (int === null) return null;
    let bits = 0;
    let foundZero = false;
    for (let i = 31; i >= 0; i--) {
      if ((int & (1 << i)) !== 0) {
        if (foundZero) return null; // not a valid netmask (bits after 0)
        bits++;
      } else {
        foundZero = true;
      }
    }
    return bits;
  }
  return null;
}

function calculateSubnet(ip: string, mask: string): Result | null {
  const ipNum = ipv4StringToInt(ip);
  const maskBits = validateMask(mask);
  if (ipNum === null || maskBits === null) return null;
  const maskNum = maskFromBits(maskBits);
  const network = ipNum & maskNum;
  const broadcast = network | (~maskNum >>> 0);
  const numberOfHosts =
    maskBits === 32
      ? 1
      : maskBits === 31
      ? 2
      : Math.max(0, (1 << (32 - maskBits)) - 2);

  const firstHost =
    maskBits >= 31 ? intToIpv4String(network) : intToIpv4String(network + 1);
  const lastHost =
    maskBits >= 31
      ? intToIpv4String(broadcast)
      : intToIpv4String(broadcast - 1);

  return {
    networkAddress: intToIpv4String(network),
    broadcastAddress: intToIpv4String(broadcast),
    numberOfHosts,
    firstHost,
    lastHost,
    maskBits,
  };
}

const recordTypeDescriptions = [
  { name: "A", desc: "Maps a hostname to IPv4 address; used in subnets to assign IPs to hosts." },
  { name: "PTR", desc: "Reverse DNS: Maps IP addresses to domain names." },
  { name: "CNAME", desc: "Alias of another domain name (not strictly subnet-specific, but relevant in larger network setups)." },
  { name: "MX", desc: "Mail exchange, for email delivery (not subnet-specific, but network-related)." },
];

const SubnetCalculatorPage: React.FC = () => {
  const [ip, setIp] = useState("");
  const [mask, setMask] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const _ip = ip.trim();
    const _mask = mask.trim();
    if (!validateIpv4(_ip)) {
      setResult(null);
      setError("Please enter a valid IPv4 address (e.g., 192.168.1.10)");
      return;
    }
    const maskBits = validateMask(_mask);
    if (maskBits === null) {
      setResult(null);
      setError("Please enter a valid subnet mask (e.g., 255.255.255.0 or 24)");
      return;
    }
    const res = calculateSubnet(_ip, _mask);
    if (!res) {
      setResult(null);
      setError("Invalid combination of IP address and subnet mask.");
      return;
    }
    setResult(res);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-start py-12 px-4">
        <section className="max-w-3xl w-full mb-8 bg-black/60 glass-morphism rounded-xl p-6 shadow border border-purple-800/20 animate-fade-in">
          <h1 className="text-4xl font-extrabold mb-3 text-gradient text-center">
            Subnet Calculator
          </h1>
          <p className="text-gray-300 mb-4 text-center">
            <span className="font-semibold">Subnetting</span> divides a large network into smaller, manageable <b>subnets</b>.
            Subnets help organize and secure networks by grouping and isolating devices.
          </p>
          <ul className="text-gray-400 text-sm mb-1 list-disc pl-6">
            <li>
              <b>Network Address</b>: Identifies the subnet itself, first address in the range.
            </li>
            <li>
              <b>Broadcast Address</b>: Used to communicate with all hosts in the subnet.
            </li>
            <li>
              <b>Subnet Mask</b>: Defines the size of the subnet (example: <span className="text-purple-300">255.255.255.0</span> or <span className="text-purple-300">/24</span>).
            </li>
            <li>
              <b>Usable Hosts</b>: The number of addresses that can be assigned to devices (excludes network/broadcast).
            </li>
          </ul>
          <div className="my-5 text-gray-400 text-sm">
            <h2 className="text-xl font-semibold text-white mb-2">DNS &amp; Record Types in Subnet Context</h2>
            <ul className="pl-4">
              {recordTypeDescriptions.map(({ name, desc }) => (
                <li key={name} className="mb-1">
                  <span className="font-semibold text-white">{name}</span>: {desc}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-gray-400 text-xs mt-4 text-center">
            Enter an <b>IPv4 address</b> and <b>subnet mask</b> (e.g., <span className="text-purple-300">255.255.255.0</span> or <span className="text-purple-300">/24</span>).
          </p>
        </section>
        <form
          onSubmit={handleCalculate}
          className="max-w-xl w-full mx-auto bg-black/50 rounded-lg p-6 border border-gray-800 mb-6 shadow"
        >
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <div className="w-full">
              <label className="block font-medium mb-1">IPv4 Address</label>
              <Input
                type="text"
                placeholder="e.g., 192.168.1.10"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                required
                className="bg-black text-white border-purple-800 focus:ring-purple-500"
              />
            </div>
            <div className="w-full">
              <label className="block font-medium mb-1">
                Subnet Mask <span className="font-light text-gray-400">(CIDR or dot-decimal)</span>
              </label>
              <Input
                type="text"
                placeholder="255.255.255.0 or 24"
                value={mask}
                onChange={(e) => setMask(e.target.value)}
                required
                className="bg-black text-white border-purple-800 focus:ring-purple-500"
              />
            </div>
          </div>
          <Button type="submit" className="w-full mt-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            Calculate Subnet
          </Button>
          {error && (
            <div className="mt-3 text-red-400 text-sm text-center">{error}</div>
          )}
        </form>
        {result && (
          <section className="max-w-xl w-full bg-black/60 rounded-lg p-6 border border-purple-800 shadow text-left animate-fade-in duration-300">
            <h2 className="text-2xl font-bold mb-2 text-purple-300">Subnet Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-lg">
              <div>
                <span className="font-semibold">Network Address:</span>
                <span className="ml-2 text-white">{result.networkAddress}</span>
              </div>
              <div>
                <span className="font-semibold">Broadcast Address:</span>
                <span className="ml-2 text-white">{result.broadcastAddress}</span>
              </div>
              <div>
                <span className="font-semibold">Subnet Mask (Bits):</span>
                <span className="ml-2 text-white">
                  /{result.maskBits}
                </span>
              </div>
              <div>
                <span className="font-semibold">Number of Usable Hosts:</span>
                <span className="ml-2 text-white">
                  {result.numberOfHosts}
                </span>
              </div>
              <div>
                <span className="font-semibold">First Usable IP:</span>
                <span className="ml-2 text-white">{result.firstHost}</span>
              </div>
              <div>
                <span className="font-semibold">Last Usable IP:</span>
                <span className="ml-2 text-white">{result.lastHost}</span>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SubnetCalculatorPage;
