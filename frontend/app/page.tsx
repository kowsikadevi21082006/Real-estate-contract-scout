'use client';

import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ComparisonTable from '../components/ComparisonTable';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-4xl mx-auto space-y-8">

        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">Contract Scout</h1>
          <p className="text-gray-500">AI-Powered Real Estate Contract Comparison Engine</p>
        </header>

        {/* 1. Upload Section */}
        <section>
          <FileUpload />
        </section>

        {/* 2. Query Section */}
        <section className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800">2. Ask Questions</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g., Compare the pet policies and security deposits..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              {loading ? 'Searching...' : 'Compare'}
            </button>
          </div>
        </section>

        {/* 3. Results Section */}
        <section>
          <ComparisonTable data={results} loading={loading} />
        </section>

      </div>
    </main>
  );
}
