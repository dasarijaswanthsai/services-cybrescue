import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow, TableCaption } from "@/components/ui/table";
import { Boxes } from "lucide-react";

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

const ipClassDetails = [
  {
    class: "A",
    range: "1.0.0.0 – 126.255.255.255",
    defaultMask: "255.0.0.0 (/8)",
    hosts: "16,777,214",
    desc: "For large networks; starts with 1–126.",
  },
  {
    class: "B",
    range: "128.0.0.0 – 191.255.255.255",
    defaultMask: "255.255.0.0 (/16)",
    hosts: "65,534",
    desc: "For medium networks; starts with 128–191.",
  },
  {
    class: "C",
    range: "192.0.0.0 – 223.255.255.255",
    defaultMask: "255.255.255.0 (/24)",
    hosts: "254",
    desc: "For small networks; starts with 192–223.",
  },
  {
    class: "D",
    range: "224.0.0.0 – 239.255.255.255",
    defaultMask: "N/A",
    hosts: "Multicast",
    desc: "Multicast addresses.",
  },
  {
    class: "E",
    range: "240.0.0.0 – 255.255.255.255",
    defaultMask: "N/A",
    hosts: "Experimental",
    desc: "Experimental use.",
  },
];

const recordTypeDescriptions = [
  { name: "A", desc: "Maps a hostname to IPv4 address; used in subnets to assign IPs to hosts." },
  { name: "PTR", desc: "Reverse DNS: Maps IP addresses to domain names." },
  { name: "CNAME", desc: "Alias of another domain name (not strictly subnet-specific, but relevant in larger network setups)." },
  { name: "MX", desc: "Mail exchange, for email delivery (not subnet-specific, but network-related)." },
];

// Utility: compute wildcard mask from mask bits
function wildcardMask(bits: number) {
  // Invert the subnet mask
  const mask = maskFromBits(bits);
  const inv = (~mask) >>> 0;
  return intToIpv4String(inv);
}

// Utility: count total IP addresses for the given subnet
function totalIpCount(bits: number) {
  return 2 ** (32 - bits);
}

// Utility: create the range as start~end string
function ipRange(start: string, end: string) {
  return `${start} ~ ${end}`;
}

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
        {/* === Heading moved to top === */}
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
          <p className="text-gray-400 text-xs mt-4 text-center">
            Enter an <b>IPv4 address</b> and <b>subnet mask</b> (e.g., <span className="text-purple-300">255.255.255.0</span> or <span className="text-purple-300">/24</span>).
          </p>
        </section>
        {/* Moved Explanation/Intro section (with heading) above form */}

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
          <section className="max-w-2xl w-full bg-black/60 rounded-lg p-6 border border-purple-800 shadow text-left animate-fade-in duration-300 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">Subnet Details</h2>
            
            {/* Start: Detailed Table */}
            <div className="overflow-x-auto">
              <Table className="bg-black/80 rounded border border-purple-700/40">
                <TableBody>
                  <TableRow>
                    <TableHead>Network Address</TableHead>
                    <TableCell>{result.networkAddress}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Broadcast Address</TableHead>
                    <TableCell>{result.broadcastAddress}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Subnet Mask</TableHead>
                    <TableCell>
                      {maskFromBits(result.maskBits) !== 0
                        ? intToIpv4String(maskFromBits(result.maskBits))
                        : "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Slash Notation (CIDR)</TableHead>
                    <TableCell>
                      /{result.maskBits}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Wildcard Mask</TableHead>
                    <TableCell>
                      {wildcardMask(result.maskBits)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Total Addresses</TableHead>
                    <TableCell>
                      {totalIpCount(result.maskBits)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Usable Hosts</TableHead>
                    <TableCell>{result.numberOfHosts}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>First Usable IP</TableHead>
                    <TableCell>{result.firstHost}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Last Usable IP</TableHead>
                    <TableCell>{result.lastHost}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>IP Range</TableHead>
                    <TableCell>
                      {ipRange(result.firstHost, result.lastHost)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <TableCaption className="text-center pt-2">
                All subnet details are calculated based on the entered address and mask.
              </TableCaption>
            </div>
            {/* End: Detailed Table */}
          </section>
        )}
        {/* === BOXES: IP Classes & Ranges === */}
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
      </main>
      <Footer />
    </div>
  );
};

export default SubnetCalculatorPage;
