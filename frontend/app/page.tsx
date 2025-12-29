'use client';

import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ComparisonTable from '../components/ComparisonTable';
import Dashboard from '../components/Dashboard';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      console.log("Searching at http://localhost:5000/api/search...");
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (error: any) {
      console.error("Search failed:", error);
      alert(`Search Error: ${error.message || "Could not reach the server. Please ensure the backend is running."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-4xl mx-auto space-y-8">

        <header className="text-center pt-10 pb-6">
          <div className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
            PropTech Innovation
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3">
            Contract <span className="text-blue-600">Scout</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Upload multiple rental agreements and let AI identify key differences,
            <span className="text-red-500 font-medium ml-1">red flags</span>, and legal risks in seconds.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
            <div className="text-2xl mb-2">📄</div>
            <h3 className="font-bold text-slate-800">Multi-Upload</h3>
            <p className="text-xs text-slate-500 mt-1">Index 5-10 PDFs at once for parallel analysis.</p>
          </div>
          <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
            <div className="text-2xl mb-2">⚖️</div>
            <h3 className="font-bold text-slate-800">Legal AI</h3>
            <p className="text-xs text-slate-500 mt-1">Powered by Cerebras Llama 3.1 for legal extraction.</p>
          </div>
          <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
            <div className="text-2xl mb-2">🚩</div>
            <h3 className="font-bold text-slate-800">Risk Alerts</h3>
            <p className="text-xs text-slate-500 mt-1">Automatic detection of unusual or high-risk clauses.</p>
          </div>
        </section>

        {/* 1. Dashboard / Lease Expiry Tracker */}
        <section>
          <Dashboard refreshTrigger={refreshKey} />
        </section>

        {/* 2. Upload Section */}
        <section>
          <FileUpload onUploadComplete={handleUploadComplete} />
        </section>

        {/* 3. Query Section */}
        <section className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800">2. Parallel Search & Comparison</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g., Compare pet policies, security deposits, and maintenance fees..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {loading ? 'Searching...' : 'Compare'}
            </button>
          </div>
        </section>

        {/* 4. Results Section */}
        <section>
          <ComparisonTable data={results} loading={loading} />
        </section>

      </div>
    </main>
  );
}
