'use client';

import { ShieldAlert, Split, FileText, Zap } from 'lucide-react';

const features = [
    {
        icon: <ShieldAlert className="w-6 h-6 text-primary-500" />,
        title: "Red Flag Detection",
        description: "Instantly spot risky clauses like 'No Pet' policies or hidden fees before you sign.",
        color: "bg-primary-50 border-primary-100"
    },
    {
        icon: <Split className="w-6 h-6 text-primary-500" />,
        title: "Smart Comparison",
        description: "Compare multiple contracts side-by-side to choose the best lease terms.",
        color: "bg-primary-50 border-primary-100"
    },
    {
        icon: <FileText className="w-6 h-6 text-primary-500" />,
        title: "Clause Analysis",
        description: "Deep dive into specific sections with AI-powered summaries and explanations.",
        color: "bg-primary-50 border-primary-100"
    },
    {
        icon: <Zap className="w-6 h-6 text-primary-500" />,
        title: "Instant Results",
        description: "Get comprehensive reports in seconds, not hours. Speed up your workflow.",
        color: "bg-primary-50 border-primary-100"
    }
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-white relative">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-5xl font-black text-primary-900 mb-6">
                        Why choose <span className="text-primary-600">Contract Scout?</span>
                    </h2>
                    <p className="text-primary-500 text-lg">
                        Everything you need to analyze real estate contracts with confidence and speed.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="group p-8 rounded-3xl border border-primary-100 bg-white shadow-sm hover:shadow-xl hover:-tranprimary-y-1 transition-all duration-300">
                            <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-primary-900 mb-3">{feature.title}</h3>
                            <p className="text-primary-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
