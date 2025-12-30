'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { FileText, Github, FileCheck } from 'lucide-react';

export default function Navbar() {
    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-nav h-16 flex items-center">
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-rose-500 p-1.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300">
                        <FileCheck className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">
                        Contract<span className="text-rose-500">Scout</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <button onClick={() => scrollTo('features')} className="text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors">Use Cases</button>
                    <button onClick={() => scrollTo('how-it-works')} className="text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors">How it Works</button>
                    <button onClick={() => scrollTo('about')} className="text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors">About</button>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => scrollTo('upload')}
                        className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-6 shadow-md"
                    >
                        Start Analyzing
                    </Button>
                </div>
            </div>
        </nav>
    );
}
