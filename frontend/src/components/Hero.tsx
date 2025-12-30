'use client';

import { ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Hero() {
    const scrollToUpload = () => {
        document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 bg-white">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[40%] h-[70%] bg-gradient-to-bl from-rose-50 to-transparent -z-10 rounded-bl-[100px]" />
            <div className="absolute bottom-0 left-0 w-[30%] h-[50%] bg-gradient-to-tr from-slate-50 to-transparent -z-10 rounded-tr-[100px]" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center px-4 py-1.5 mb-8 text-xs font-bold tracking-wide text-rose-600 uppercase bg-rose-50 border border-rose-100 rounded-full"
                >
                    <Star className="w-3 h-3 mr-1.5 fill-rose-600" />
                    The #1 AI Contract Analyzer
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-slate-900 leading-[1.1]"
                >
                    Don't Sign Until You <br />
                    <span className="text-gradient">Know the Risks.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
                >
                    Upload your rental agreement and let our AI scout for hidden red flags,
                    unfair clauses, and legal traps in seconds.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button
                        size="lg"
                        onClick={scrollToUpload}
                        className="text-base font-bold px-8 py-6 h-auto bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-200/50 transition-all hover:scale-105 rounded-full"
                    >
                        Check My Contract
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="text-base font-bold px-8 py-6 h-auto border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full"
                    >
                        View Sample Report
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16 text-slate-400 text-sm font-bold uppercase tracking-wider"
                >
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" /> 100% Private
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" /> Instant Results
                    </div>
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-rose-500" /> Lawyer Approved
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
