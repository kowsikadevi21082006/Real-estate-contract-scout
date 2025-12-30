'use client';

export default function UseCases() {
    return (
        <section id="features" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-wide text-rose-600 uppercase bg-rose-50 rounded-full">
                            Use Cases
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                            Perfect for <br /> <span className="text-rose-500">Every Tenant.</span>
                        </h2>
                        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                            Whether you are a student renting your first apartment or a family moving into a new home,
                            Contract Scout ensures you never get caught off guard by hidden fees or unfair eviction rules.
                        </p>

                        <ul className="space-y-4">
                            {['Students & Universities', 'Expats & International Movers', 'First-time Renters', 'Small Business Leases'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <span className="text-emerald-600 text-xs">✓</span>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex-1 relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-slate-100 rounded-3xl transform rotate-3 scale-95 -z-10" />
                        <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl text-white transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="ml-auto text-xs text-slate-400 font-mono">analysis_result.json</span>
                            </div>
                            <div className="space-y-4 font-mono text-sm opacity-90">
                                <p><span className="text-rose-400">Warning:</span> "Landlord may enter premises without notice..."</p>
                                <p><span className="text-rose-400">Alert:</span> "Security deposit return period: 90 days"</p>
                                <p><span className="text-emerald-400">Success:</span> "Rent control compliant"</p>
                                <p className="text-slate-500 pt-4">// AI Analysis Complete</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
