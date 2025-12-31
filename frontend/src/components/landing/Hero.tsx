'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useState } from 'react';
import VideoModal from '../VideoModal';

export default function Hero() {
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/40 rounded-full blur-[100px] -tranprimary-y-1/2 tranprimary-x-1/2 -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-200/40 rounded-full blur-[100px] tranprimary-y-1/2 -tranprimary-x-1/2 -z-10" />

            <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">

                {/* Text Content */}
                <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-semibold tracking-wide">
                        ✨ AI-Powered Real Estate Analysis
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-black text-primary-900 leading-[1.1] tracking-tight">
                        Contracts made <br />
                        <span className="text-primary-950">
                            simple & smart.
                        </span>
                    </h1>

                    <p className="text-xl text-primary-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
                        Unlock smarter workflows with AI tools designed to scout red flags, compare leases, and help you sign with confidence.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <Link href="/dashboard">
                            <Button className="h-14 px-8 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 transition-all w-full sm:w-auto">
                                Get Started
                            </Button>
                        </Link>

                        <Button
                            variant="outline"
                            className="h-14 px-8 rounded-full border-primary-200 hover:bg-primary-50 text-primary-700 font-bold text-lg gap-2 w-full sm:w-auto"
                            onClick={() => setIsVideoOpen(true)}
                        >
                            <Play className="w-5 h-5 fill-primary-700" />
                            Watch Demo
                        </Button>
                    </div>

                    <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Trust Badges / Logos Placeholder */}
                        <div className="font-bold text-primary-400 text-sm uppercase tracking-widest">Trusted by 1000+ Agents</div>
                    </div>
                </div>

                {/* Hero Image/Visual */}
                <div className="lg:w-1/2 relative z-10">
                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary-500/20 border-8 border-white bg-primary-50">
                        {/* Abstract App Mockup Representation */}
                        <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-10 hover:scale-105 transition-transform duration-700"></div>
                            <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl w-3/4 transform group-hover:-tranprimary-y-2 transition-transform duration-500">
                                <div className="h-2 w-20 bg-primary-200 rounded-full mb-4"></div>
                                <div className="h-2 w-full bg-primary-100 rounded-full mb-2"></div>
                                <div className="h-2 w-5/6 bg-primary-100 rounded-full mb-6"></div>
                                <div className="flex gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <div className="h-3 w-24 bg-primary-200 rounded-full mb-2"></div>
                                        <div className="h-2 w-16 bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full text-center">Approved</div>
                                    </div>
                                </div>
                                <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex gap-3 items-start">
                                    <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                                    <div className="text-xs text-red-700">High Risk Clause Detected: Tenant responsible for structural repairs.</div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -right-6 top-20 bg-white p-4 rounded-xl shadow-lg border border-primary-100 animate-bounce delay-700 duration-1000">
                                <div className="text-2xl font-bold text-primary-900">98%</div>
                                <div className="text-xs text-primary-500">Accuracy</div>
                            </div>
                            <div className="absolute -left-6 bottom-20 bg-white p-4 rounded-xl shadow-lg border border-primary-100 animate-bounce delay-100 duration-1000">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-primary-200 border-2 border-white"></div>)}
                                </div>
                                <div className="text-xs text-primary-500 mt-2 text-center">Happy Users</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
        </section>
    );
}
