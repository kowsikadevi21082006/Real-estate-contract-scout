'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutUs from '@/components/AboutUs';
import UseCases from '@/components/UseCases';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import Dashboard from '@/components/Dashboard';
import ComparisonTable from '@/components/ComparisonTable';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
            <Navbar />
            <Hero />
            <UseCases />
            <AboutUs />

            <section id="upload" className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-wide text-rose-600 uppercase bg-rose-50 rounded-full">
                            Demo
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
                            Try it Now
                        </h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            Experience the power of AI contract analysis right here.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        <div className="lg:col-span-1">
                            <FileUpload onUploadComplete={handleUploadComplete} />
                        </div>

                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                                    <Search className="w-5 h-5 text-rose-500" />
                                    Smart Comparison
                                </h3>

                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Input
                                            placeholder="Compare 'pet policies', 'late fees'..."
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            className="bg-slate-50 border-slate-200 text-slate-900 focus:ring-rose-200 h-11 pl-4 rounded-lg"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleSearch}
                                        disabled={loading}
                                        className="bg-slate-900 hover:bg-slate-800 text-white h-11 px-6 rounded-lg font-bold"
                                    >
                                        {loading ? '...' : 'Compare'}
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
            </section>

            <Footer />
        </div>
    );
}
