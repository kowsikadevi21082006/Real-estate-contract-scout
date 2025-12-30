'use client';

import { CheckCircle2, Search, FileText, AlertTriangle } from 'lucide-react';

export default function AboutUs() {
    const steps = [
        {
            icon: <FileText className="w-6 h-6 text-white" />,
            title: "Upload Contract",
            desc: "Simply drag and drop your PDF rental agreement.",
            color: "bg-blue-500"
        },
        {
            icon: <Search className="w-6 h-6 text-white" />,
            title: "AI Scanning",
            desc: "Our engine analyzes every clause against legal standards.",
            color: "bg-rose-500"
        },
        {
            icon: <AlertTriangle className="w-6 h-6 text-white" />,
            title: "Risk Detection",
            desc: "Get instant alerts on unfair terms and red flags.",
            color: "bg-amber-500"
        },
        {
            icon: <CheckCircle2 className="w-6 h-6 text-white" />,
            title: "Peace of Mind",
            desc: "Sign with confidence knowing fast exactly what you're agreeing to.",
            color: "bg-emerald-500"
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">How It Works</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        Complex legal jargon turned into simple, actionable insights in three easy steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className={`absolute top-0 left-0 w-full h-1 ${step.color}`} />
                            <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center mb-6 shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform`}>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
