
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CLOUDFLARE_API = "https://cloudflare-dns.com/dns-query?name=";

const recordTypes = ["A", "AAAA", "CNAME", "MX", "TXT"];

function parseRecords(answer: any[], type: string) {
  if (!Array.isArray(answer)) return [];
  if (type === "TXT") {
    return answer.filter(rec => rec.type === 16).map(rec => rec.data.replace(/"/g, ""));
  }
  if (type === "A") {
    return answer.filter(rec => rec.type === 1).map(rec => rec.data);
  }
  if (type === "AAAA") {
    return answer.filter(rec => rec.type === 28).map(rec => rec.data);
  }
  if (type === "CNAME") {
    return answer.filter(rec => rec.type === 5).map(rec => rec.data);
  }
  if (type === "MX") {
    return answer.filter(rec => rec.type === 15).map(rec => rec.data);
  }
  return [];
}

const DnsLookup: React.FC = () => {
  const [domain, setDomain] = useState("");
  const [recType, setRecType] = useState("A");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const res = await fetch(
        `${CLOUDFLARE_API}${encodeURIComponent(domain)}&type=${recType}`,
        { headers: { Accept: "application/dns-json" } }
      );
      if (!res.ok) throw new Error("NS lookup failed.");
      const data = await res.json();
      const answers = parseRecords(data.Answer, recType);
      if (answers.length === 0) {
        setResults([]);
        setError("No results found for that record type.");
      } else {
        setResults(answers);
      }
    } catch (err: any) {
      setError("Could not complete DNS lookup.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section
      id="dnslookup"
      className="max-w-lg mx-auto my-20 bg-black/60 glass-morphism rounded-xl p-8 shadow-lg border border-purple-800/20 animate-fade-in"
    >
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gradient mb-3 text-center">
        Domain DNS Lookup
      </h2>
      <p className="text-gray-400 mb-6 text-center">
        Check DNS A, AAAA, CNAME, MX, or TXT records for any domain. No data is stored.
      </p>
      <form className="flex flex-col sm:flex-row gap-3 mb-4" onSubmit={onSubmit} autoComplete="off">
        <Input
          aria-label="Domain"
          type="text"
          placeholder="Enter domain (e.g. example.com)"
          value={domain}
          required
          onChange={e => setDomain(e.target.value)}
          className="flex-1"
        />
        <select
          value={recType}
          onChange={e => setRecType(e.target.value)}
          className="rounded-md border bg-background/70 border-purple-600 text-white px-3 py-2"
          aria-label="Record type"
        >
          {recordTypes.map(t => (
            <option value={t} key={t}>{t}</option>
          ))}
        </select>
        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 transition-colors font-semibold min-w-[120px]"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 border-2 border-t-2 border-white rounded-full animate-spin inline-block" />{" "}
              Looking up...
            </span>
          ) : (
            "Lookup"
          )}
        </Button>
      </form>
      {error && (
        <div className="text-red-500 text-sm mb-2">{error}</div>
      )}
      {results && (
        <div className="mt-4 space-y-2">
          <div className="text-gray-300 mb-2 font-medium">
            Results ({recType}):
          </div>
          {results.length === 0 ? (
            <div className="text-gray-400">No records found.</div>
          ) : (
            results.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-black/80 border border-purple-900/30 rounded px-3 py-2 hover-scale transition cursor-pointer"
                onClick={() => handleCopy(item)}
                tabIndex={0}
                role="button"
                aria-label={`Copy ${item}`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') handleCopy(item)
                }}
              >
                <span className="text-white select-text">{item}</span>
                <span className={`ml-3 text-xs px-2 py-1 rounded-full ${copied ? "bg-green-500 text-black" : "bg-purple-700 text-white"} transition`}>
                  {copied ? "Copied!" : "Copy"}
                </span>
              </div>
            ))
          )}
          <p className="text-xs mt-1 text-gray-500">
            Click on any record to copy it to the clipboard.
          </p>
        </div>
      )}
    </section>
  );
};

export default DnsLookup;
