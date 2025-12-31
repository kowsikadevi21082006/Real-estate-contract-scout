'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from '@/components/FileUpload';
import Dashboard from '@/components/Dashboard';
import ComparisonTable from '@/components/ComparisonTable';
import Link from 'next/link';

export default function DashboardPage() {
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
            const response = await fetch('http://localhost:5000/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });
            if (!response.ok) throw new Error("Search failed");
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <nav className="glass-nav px-6 py-4 flex justify-between items-center mb-8 bg-white/80 border-b border-primary-100">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20">
                        S
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-900">ContractScout</span>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200">K</div>
                </div>
            </nav>

            <div className="container mx-auto px-6 pb-12">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-primary-950 tracking-tight">Dashboard</h1>
                        <p className="text-primary-600/80 mt-1 font-medium">Manage and analyze your contracts</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="lg:col-span-1">
                        <FileUpload onUploadComplete={handleUploadComplete} />
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-primary-900/5 border border-primary-100 relative overflow-hidden group hover:border-primary-200 transition-colors">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50" />

                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary-900">
                                <Search className="w-5 h-5 text-primary-500" />
                                Smart Comparison
                            </h3>

                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <Input
                                        placeholder="Compare 'pet policies', 'late fees'..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="bg-primary-50/50 border-primary-100 text-primary-900 placeholder:text-primary-400 focus:ring-primary-200 focus:border-primary-300 h-12 pl-4 rounded-xl transition-all"
                                    />
                                </div>
                                <Button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="bg-primary-600 hover:bg-primary-700 text-white h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all"
                                >
                                    {loading ? 'Analyzing...' : 'Compare'}
                                </Button>
                            </div>

                            <div className="mt-8">
                                <ComparisonTable data={results} loading={loading} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <Dashboard refreshTrigger={refreshKey} />
                </div>
            </div>
        </div>
    );
}
