'use client';

import { FileCheck, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-rose-500 p-1.5 rounded-lg">
                                <FileCheck className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                Contract<span className="text-rose-500">Scout</span>
                            </span>
                        </div>
                        <p className="max-w-xs text-slate-400 leading-relaxed">
                            AI-powered protection for your rental agreements.
                            Detect risks before you sign.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-12">
                        <div>
                            <h4 className="text-white font-bold mb-6">Product</h4>
                            <ul className="space-y-4 text-sm">
                                <li><a href="#" className="hover:text-rose-500 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-rose-500 transition-colors">Use Cases</a></li>
                                <li><a href="#" className="hover:text-rose-500 transition-colors">Sample Analysis</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6">Company</h4>
                            <ul className="space-y-4 text-sm">
                                <li><a href="#" className="hover:text-rose-500 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-rose-500 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-rose-500 transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm text-slate-500">
                        &copy; {new Date().getFullYear()} Contract Scout. All rights reserved.
                    </p>
                    <p className="text-gray-500 font-medium mt-1">
                        Created with ❤️ by <span className="text-rose-500 font-bold pointer-events-none">Kowsika</span>
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
